import type { Metadata } from "next";
import type { ValidYear } from "@/constants/config";
import AnnouncementPage from "@/modules/landing/announcement/components/AnnouncementPage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: "Awards Nomination",
    description: `EBISION ${year} Awards Nomination — Best Paper, Best Student Paper, Exemplary Lecturer, Young Researcher, Promising Graduate Student, and Industry Pioneer Awards.`,
    keywords: [`EBISION ${year} awards`, "awards nomination", "best paper award"],
    openGraph: {
      title: `Awards Nomination — EBISION ${year}`,
      description: `EBISION ${year} Awards Nomination. Learn about award categories and nomination requirements.`,
    },
    twitter: {
      title: `Awards Nomination — EBISION ${year}`,
      description: `EBISION ${year} Awards Nomination.`,
    },
    alternates: { canonical: `/${year}/announcement` },
  };
}

export default async function Page({ params }: PageProps) {
  const { year } = await params;
  return <AnnouncementPage year={Number(year) as ValidYear} />;
}
