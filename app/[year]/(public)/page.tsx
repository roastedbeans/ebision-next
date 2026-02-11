import type { Metadata } from "next";
import type { ValidYear } from "@/constants/config";
import HomePage from "@/modules/landing/home/components/HomePage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `EBISION ${year} — International Symposium on E-Business Information Systems Evolution`,
    description: `The IFIP WG 8.4 International Symposium on E-Business Information Systems Evolution. EBISION ${year}.`,
    alternates: {
      canonical: `/${year}`,
    },
  };
}

export default async function Home({ params }: PageProps) {
  const { year } = await params;
  const yearNum = Number(year) as ValidYear;
  return <HomePage year={yearNum} />;
}
