import type { Metadata } from "next";
import type { ValidYear } from "@/constants/config";
import OrganizationPage from "@/modules/landing/organization/components/OrganizationPage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: "Symposium Organization",
    description: `Meet the EBISION ${year} organizing committee. Organized and hosted by IFIP WG 8.4.`,
    keywords: [`EBISION ${year} organization`, "conference committee", "IFIP WG 8.4"],
    openGraph: {
      title: `Symposium Organization — EBISION ${year}`,
      description: `Meet the EBISION ${year} organizing committee.`,
    },
    twitter: {
      title: `Symposium Organization — EBISION ${year}`,
      description: `Meet the EBISION ${year} organizing committee.`,
    },
    alternates: { canonical: `/${year}/organization` },
  };
}

export default async function Page({ params }: PageProps) {
  const { year } = await params;
  return <OrganizationPage year={Number(year) as ValidYear} />;
}
