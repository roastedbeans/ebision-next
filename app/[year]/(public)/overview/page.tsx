import type { Metadata } from "next";
import type { ValidYear } from "@/constants/config";
import OverviewPage from "@/modules/landing/overview/components/OverviewPage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: "Overview",
    description: `EBISION ${year} — Explore the paradigm shift in E-Business Information Systems through multidisciplinary perspectives.`,
    keywords: [`EBISION ${year}`, "E-Business Information Systems", "IFIP WG 8.4"],
    openGraph: {
      title: `Overview — EBISION ${year}`,
      description: "Explore the paradigm shift in E-Business Information Systems.",
    },
    twitter: {
      title: `Overview — EBISION ${year}`,
      description: "Explore the paradigm shift in E-Business Information Systems.",
    },
    alternates: { canonical: `/${year}/overview` },
  };
}

export default async function Page({ params }: PageProps) {
  const { year } = await params;
  return <OverviewPage year={Number(year) as ValidYear} />;
}
