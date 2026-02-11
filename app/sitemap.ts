import type { MetadataRoute } from "next";
import { CURRENT_YEAR, VALID_YEARS } from "@/constants/config";
import { SITE_URL } from "@/constants/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/overview", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/organization", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/previous-events", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/keynotes", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/author-instruction", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/announcement", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/lifetime-achievement", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/program", priority: 0.8, changeFrequency: "weekly" as const },
  ];

  // Root URL redirects to the current year
  const rootEntry: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 1.0,
    },
  ];

  // Generate entries for each valid year
  const yearEntries = VALID_YEARS.flatMap((year) =>
    routes.map((route) => ({
      url: `${SITE_URL}/${year}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      // Current year pages get higher priority than archive years
      priority: year === CURRENT_YEAR ? route.priority : route.priority * 0.6,
    })),
  );

  return [...rootEntry, ...yearEntries];
}
