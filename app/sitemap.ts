import type { MetadataRoute } from "next";
import { posts } from "@/lib/posts";
import { cities } from "@/lib/cities";

const BASE_URL = "https://nawa-mariage.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/rencontre/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/faq/`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/register/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/login/`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}/`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/rencontre/${city.slug}/`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes, ...cityRoutes];
}
