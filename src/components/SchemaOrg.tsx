import { getSetting } from "@/lib/db";

/**
 * Schema.org DrivingSchool — auf jeder Seite (Site-Layout).
 */
export default function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    name: "Fahrschule Toros",
    url: "https://fahrschuletoros.de/",
    telephone: "+49 " + getSetting("telefon").replace(/^0/, ""),
    email: getSetting("email"),
    image: "https://fahrschuletoros.de/img/hero-fahrschule.jpg",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${getSetting("adresse_1")}, ${getSetting("adresse_2")}`,
      postalCode: "14558",
      addressLocality: "Nuthetal",
      addressRegion: "Brandenburg",
      addressCountry: "DE",
    },
    areaServed: ["Potsdam", "Nuthetal", "Bergholz-Rehbrücke", "Michendorf", "Saarmund"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "09:00",
        closes: "16:00",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
