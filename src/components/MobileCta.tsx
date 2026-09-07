"use client";

import { Icon } from "./icons";

/**
 * Mobile Sticky-Leiste. Der Funnel-Button springt zur Funnel-Sektion der
 * aktuellen Seite, falls vorhanden — sonst zum Funnel auf der Startseite.
 */
export default function MobileCta({ telefon }: { telefon: string }) {
  const zumFunnel = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const ziel = document.getElementById("funnel");
    if (ziel) {
      e.preventDefault();
      ziel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mobile-cta">
      <a className="ruf" href={"tel:" + telefon.replace(/[^\d+]/g, "")}>
        <Icon name="phone" /> Anrufen
      </a>
      <a className="plan" href="/#funnel" onClick={zumFunnel}>
        <Icon name="flash" /> Führerschein-Check
      </a>
    </div>
  );
}
