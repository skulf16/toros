import type { Metadata } from "next";
import { getSetting } from "@/lib/db";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "Danke", robots: { index: false } };

export default function Danke() {
  const telefon = getSetting("telefon");
  return (
    <section className="danke-hero">
      <div className="wrap">
        <div className="ring">
          <Icon name="check" />
        </div>
        <h1>Danke für deine Anmeldung!</h1>
        <p style={{ fontSize: "1.15rem", maxWidth: "44ch", marginInline: "auto" }}>
          Wir melden uns innerhalb eines Werktags persönlich bei dir. Wenn es schnell gehen soll:
          Ruf uns einfach direkt an.
        </p>
        <p style={{ marginTop: "1.6rem" }}>
          <a className="t-btn t-btn--dark" href={"tel:" + telefon.replace(/[^\d+]/g, "")}>
            <Icon name="phone" /> {telefon}
          </a>
        </p>
      </div>
    </section>
  );
}
