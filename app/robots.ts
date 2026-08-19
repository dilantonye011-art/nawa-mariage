import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/messages/", "/profile/", "/matches/", "/discover/", "/login/", "/register/"],
      },
    ],
    sitemap: "https://nawa-mariage.vercel.app/sitemap.xml",
  };
}
