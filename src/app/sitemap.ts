import type { MetadataRoute } from "next";

const BASIS = process.env.SITE_URL || "https://fahrschuletoros.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const seiten = [
    "",
    "/motorradfuehrerschein-potsdam",
    "/anhaenger-fuehrerschein-potsdam",
    "/seminare",
    "/theorieplan",
    "/motorrad",
    "/impressum",
    "/datenschutz",
  ];
  return seiten.map((pfad) => ({
    url: `${BASIS}${pfad}`,
    changeFrequency: pfad === "/theorieplan" || pfad === "" ? "weekly" : "monthly",
    priority: pfad === "" ? 1 : 0.7,
  }));
}
