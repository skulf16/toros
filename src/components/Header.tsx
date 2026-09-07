"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AnmeldungButton from "./AnmeldungButton";
import { Icon } from "./icons";

const NAV = [
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/#pkw-fuehrerschein", label: "PKW" },
  { href: "/motorradfuehrerschein-potsdam", label: "Motorrad" },
  { href: "/anhaenger-fuehrerschein-potsdam", label: "Anhänger" },
  { href: "/seminare", label: "Seminare" },
  { href: "/#fuhrpark", label: "Fuhrpark" },
  { href: "/theorieplan", label: "Termine" },
];

export type BannerProps = {
  aktiv: boolean;
  text: string;
};

export default function Header({
  anmeldungUrl,
  banner,
}: {
  anmeldungUrl: string;
  banner?: BannerProps;
}) {
  const [offen, setOffen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header${stuck ? " is-stuck" : ""}${offen ? " nav-open" : ""}`}
      id="site-header"
    >
      {banner?.aktiv && banner.text ? (
        <Link className="aktions-banner" href="/#anmelden" role="status">
          <span>{banner.text}</span>
          <span className="mehr">Mehr erfahren →</span>
        </Link>
      ) : null}
      <div className="bar">
        <Link className="brand" href="/" aria-label="Fahrschule Toros — Startseite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.png" alt="Fahrschule Toros" width={140} height={52} />
        </Link>

        <nav className="main-nav" id="main-nav" aria-label="Hauptnavigation">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOffen(false)}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <AnmeldungButton className="t-btn t-btn--cyan nav-cta" url={anmeldungUrl}>
          Zur Onlineanmeldung
        </AnmeldungButton>

        <button
          className="nav-toggle"
          aria-expanded={offen}
          aria-controls="main-nav"
          aria-label={offen ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOffen(!offen)}
        >
          <Icon name={offen ? "x" : "menu"} />
        </button>
      </div>
    </header>
  );
}
