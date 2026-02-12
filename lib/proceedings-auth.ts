import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "proceedings-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getProceedingsAuthCookie(request: NextRequest): string {
  return request.cookies.get(COOKIE_NAME)?.value ?? "";
}

function getSecret(): string {
  return process.env.PROCEEDINGS_SECRET || process.env.PROCEEDINGS_PASSWORD || "";
}

export function createProceedingsToken(): string {
  const secret = getSecret();
  if (!secret) return "";
  const expiry = String(Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE);
  const signature = createHmac("sha256", secret).update(expiry).digest("base64url");
  return `${expiry}.${signature}`;
}

export function verifyProceedingsToken(token: string): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;
  const [expiryStr, signature] = token.split(".");
  if (!expiryStr || !signature) return false;
  const expiry = Number.parseInt(expiryStr, 10);
  if (Number.isNaN(expiry) || expiry < Math.floor(Date.now() / 1000)) return false;
  const expected = createHmac("sha256", secret).update(expiryStr).digest("base64url");
  try {
    return timingSafeEqual(Buffer.from(signature, "base64url"), Buffer.from(expected, "base64url"));
  } catch {
    return false;
  }
}

export function isProceedingsPasswordRequired(): boolean {
  return !!process.env.PROCEEDINGS_PASSWORD;
}

export function isProceedingsAuthenticated(request: NextRequest): boolean {
  if (!isProceedingsPasswordRequired()) return true;
  const cookie = getProceedingsAuthCookie(request);
  return verifyProceedingsToken(cookie);
}

export const PROCEEDINGS_AUTH_COOKIE = COOKIE_NAME;
export const PROCEEDINGS_AUTH_MAX_AGE = COOKIE_MAX_AGE;
