import type { MetadataRoute } from "next";
import { getAllTours } from "@/lib/content/tours";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://conscioustravel.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/tours`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/stays`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    {
      url: `${BASE_URL}/stays/the-mangrove-house`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${BASE_URL}/sustainability`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${BASE_URL}/inquiry`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/press`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    {
      url: `${BASE_URL}/booking-terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  let tourRoutes: MetadataRoute.Sitemap = [];
  try {
    const tours = await getAllTours();
    tourRoutes = tours.map((t) => ({
      url: `${BASE_URL}/tours/${t.slug}`,
      lastModified: t.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB not reachable during build — skip dynamic routes.
  }

  return [...staticRoutes, ...tourRoutes];
}
