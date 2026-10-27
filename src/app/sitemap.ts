import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl();
  // Fragment links belong to the same page, not separate sitemap entries.
  // Never publish a fabricated domain or localhost in the sitemap.
  return url ? [{ url: `${url}/` }] : [];
}
