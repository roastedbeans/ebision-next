import type { Metadata } from "next";
import KeynotesPage from "@/modules/landing/keynotes/components/KeynotesPage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: "Keynote Speakers",
    description: `Meet the distinguished keynote speakers at EBISION ${year}.`,
    keywords: [`EBISION ${year} keynotes`, "keynote speakers"],
    openGraph: {
      title: `Keynote Speakers — EBISION ${year}`,
      description: `Meet the distinguished keynote speakers at EBISION ${year}.`,
    },
    twitter: {
      title: `Keynote Speakers — EBISION ${year}`,
      description: `Meet the distinguished keynote speakers at EBISION ${year}.`,
    },
    alternates: { canonical: `/${year}/keynotes` },
  };
}

export default function Page() {
  return <KeynotesPage />;
}
