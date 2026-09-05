import type { MetadataRoute } from "next";

import { getAllCaseStudies } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...getAllCaseStudies().map((s) => ({
      url: `${SITE_URL}/work/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
