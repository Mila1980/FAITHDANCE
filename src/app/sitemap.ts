import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.faithindance.com";
  return [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/book`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/prayers`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/membership`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
