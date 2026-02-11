import type { Metadata } from "next";
import ProgramSchedulePage from "@/modules/landing/program/ProgramSchedulePage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: "Program Schedule",
    description: `View the EBISION ${year} program schedule. Conference sessions, keynote talks, and paper presentations.`,
    keywords: [`EBISION ${year} program`, "conference schedule", "session program"],
    openGraph: {
      title: `Program Schedule — EBISION ${year}`,
      description: `View the EBISION ${year} program schedule.`,
    },
    twitter: {
      title: `Program Schedule — EBISION ${year}`,
      description: `View the EBISION ${year} program schedule.`,
    },
    alternates: { canonical: `/${year}/program` },
  };
}

export default function ProgramRoute() {
  return <ProgramSchedulePage />;
}
