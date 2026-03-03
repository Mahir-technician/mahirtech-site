import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mahirtech.com";
  return [{ url: baseUrl, changeFrequency: "weekly", priority: 1 }];
}