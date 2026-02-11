import type { Metadata } from "next";
import LifetimeAchievementPage from "@/modules/landing/lifetime-achievement/components/LifetimeAchievementPage";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: "Lifetime Achievement Award",
    description: `EBISION ${year} Lifetime Achievement Award. Recognizing outstanding contributions to E-Business Information Systems.`,
    keywords: [`EBISION ${year} lifetime achievement`, "conference award"],
    openGraph: {
      title: `Lifetime Achievement Award — EBISION ${year}`,
      description: `EBISION ${year} Lifetime Achievement Award.`,
    },
    twitter: {
      title: `Lifetime Achievement Award — EBISION ${year}`,
      description: `EBISION ${year} Lifetime Achievement Award.`,
    },
    alternates: { canonical: `/${year}/lifetime-achievement` },
  };
}

export default function Page() {
  return <LifetimeAchievementPage />;
}
