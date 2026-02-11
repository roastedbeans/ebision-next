import type { Metadata } from "next";
import type { ValidYear } from "@/constants/config";
import ContactPage from "@/modules/landing/contact/components/ContactPage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: "Contact Us",
    description: `Get in touch with the EBISION ${year} organizing committee.`,
    keywords: [`EBISION ${year} contact`, "conference contact", "IFIP WG 8.4 contact"],
    openGraph: {
      title: `Contact Us — EBISION ${year}`,
      description: `Get in touch with the EBISION ${year} organizing committee.`,
    },
    twitter: {
      title: `Contact Us — EBISION ${year}`,
      description: `Get in touch with the EBISION ${year} organizing committee.`,
    },
    alternates: { canonical: `/${year}/contact` },
  };
}

export default async function Page({ params }: PageProps) {
  const { year } = await params;
  return <ContactPage year={Number(year) as ValidYear} />;
}
