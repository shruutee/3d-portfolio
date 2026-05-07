import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/#about`, lastModified: now, priority: 0.8 },
    { url: `${base}/#projects`, lastModified: now, priority: 0.9 },
    { url: `${base}/#contact`, lastModified: now, priority: 0.7 },
  ];
}