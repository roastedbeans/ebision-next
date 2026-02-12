import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createProceedingsToken,
  getProceedingsAuthCookie,
  isProceedingsPasswordRequired,
  PROCEEDINGS_AUTH_COOKIE,
  PROCEEDINGS_AUTH_MAX_AGE,
  verifyProceedingsToken,
} from "@/lib/proceedings-auth";

export async function POST(request: NextRequest) {
  if (!isProceedingsPasswordRequired()) {
    return NextResponse.json(
      { ok: false, error: "Proceeding access is not configured" },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const password = process.env.PROCEEDINGS_PASSWORD ?? "";
  const submitted = body.password ?? "";
  if (submitted !== password) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  const token = createProceedingsToken();
  if (!token) {
    return NextResponse.json({ ok: false, error: "Unable to create session" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(PROCEEDINGS_AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PROCEEDINGS_AUTH_MAX_AGE,
    path: "/",
  });
  return response;
}

export async function GET(request: NextRequest) {
  const required = isProceedingsPasswordRequired();
  const cookie = getProceedingsAuthCookie(request);
  const authenticated = !required || verifyProceedingsToken(cookie);
  return NextResponse.json({ ok: true, authenticated, required });
}
