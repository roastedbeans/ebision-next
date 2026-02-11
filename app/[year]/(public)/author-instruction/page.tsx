import type { Metadata } from "next";
import type { ValidYear } from "@/constants/config";
import AuthorInstructionPage from "@/modules/landing/author-instruction/components/AuthorInstructionPage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: "Author Instructions",
    description: `Complete author instructions and submission guidelines for EBISION ${year}.`,
    keywords: [`EBISION ${year} author instructions`, "paper submission guidelines"],
    openGraph: {
      title: `Author Instructions — EBISION ${year}`,
      description: `Author instructions and submission guidelines for EBISION ${year}.`,
    },
    twitter: {
      title: `Author Instructions — EBISION ${year}`,
      description: `Author instructions and submission guidelines for EBISION ${year}.`,
    },
    alternates: { canonical: `/${year}/author-instruction` },
  };
}

export default async function Page({ params }: PageProps) {
  const { year } = await params;
  return <AuthorInstructionPage year={Number(year) as ValidYear} />;
}
