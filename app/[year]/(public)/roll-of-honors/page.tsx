import type { Metadata } from "next";
import type { ValidYear } from "@/constants/config";
import { YEAR_CONFIG } from "@/constants/config";
import { SITE_URL } from "@/constants/seo";
import RollOfHonorsPage from "@/modules/landing/roll-of-honors/components/RollOfHonorsPage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  const config = YEAR_CONFIG[Number(year) as ValidYear];
  const pageUrl = `${SITE_URL}/${year}/roll-of-honors`;
  const description = `EBISION ${year} Roll of Honors — Best Paper, Best Student Paper, Exemplary Lecturer, Young Researcher, Promising Graduate Student, Industry Pioneer. ${config.venue}, ${config.dates}.`;

  return {
    title: "Roll of Honors",
    description,
    keywords: [`EBISION ${year} awards`, "roll of honors", "conference awards", config.venue],
    openGraph: {
      url: pageUrl,
      title: `Roll of Honors | EBISION ${year}`,
      description,
      images: [`${SITE_URL}/${year}/opengraph-image`],
    },
    twitter: {
      title: `Roll of Honors | EBISION ${year}`,
      description,
      images: [`${SITE_URL}/${year}/opengraph-image`],
    },
    alternates: { canonical: `/${year}/roll-of-honors` },
  };
}

export default async function Page({ params }: PageProps) {
  const { year } = await params;
  return <RollOfHonorsPage year={Number(year) as ValidYear} />;
}
