import type { Metadata } from "next";
import type { ValidYear } from "@/constants/config";
import PreviousEventsPage from "@/modules/landing/previous-events/components/PreviousEventsPage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: "Previous Events",
    description:
      "Explore the history of EBISION conferences. View past events, host locations, and proceedings.",
    keywords: ["EBISION previous events", "EBISION history", "past conferences"],
    openGraph: {
      title: `Previous Events — EBISION ${year}`,
      description: "Explore the history of EBISION conferences.",
    },
    twitter: {
      title: `Previous Events — EBISION ${year}`,
      description: "Explore the history of EBISION conferences.",
    },
    alternates: { canonical: `/${year}/previous-events` },
  };
}

export default async function Page({ params }: PageProps) {
  const { year } = await params;
  return <PreviousEventsPage year={Number(year) as ValidYear} />;
}
