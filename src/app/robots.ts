import type { MetadataRoute } from "next";

const BASIS = process.env.SITE_URL || "https://fahrschuletoros.de";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/leads", "/api"] }],
    sitemap: `${BASIS}/sitemap.xml`,
  };
}
