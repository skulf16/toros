"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS: Record<string, React.ReactNode> = {
  kalender: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </>
  ),
  megafon: (
    <>
      <path d="M3 10.5v3a1.5 1.5 0 0 0 1.5 1.5H7l9 5V4.5l-9 5H4.5A1.5 1.5 0 0 0 3 10.5Z" />
      <path d="M19.5 9.5a4 4 0 0 1 0 5" />
    </>
  ),
  bild: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="M4.5 18.5 10 13l3.5 3.5 3-3 3 3" />
    </>
  ),
  zahnrad: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.7M12 18.5v2.7M2.8 12h2.7M18.5 12h2.7M5.5 5.5l1.9 1.9M16.6 16.6l1.9 1.9M18.5 5.5l-1.9 1.9M7.4 16.6l-1.9 1.9" />
    </>
  ),
};

const PUNKTE = [
  { href: "/admin/termine", label: "Theorietermine", kurz: "Termine", icon: "kalender" },
  { href: "/admin/aktionen", label: "Aktions-Banner", kurz: "Aktionen", icon: "megafon" },
  { href: "/admin/galerie", label: "Erfolgsgeschichten", kurz: "Galerie", icon: "bild" },
  { href: "/admin/einstellungen", label: "Einstellungen", kurz: "Mehr", icon: "zahnrad" },
];

export default function AdminNavLinks() {
  const pfad = usePathname();
  return (
    <>
      {PUNKTE.map((p) => (
        <Link key={p.href} href={p.href} className={pfad.startsWith(p.href) ? "aktiv" : ""}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {ICONS[p.icon]}
          </svg>
          <span className="nav-lang">{p.label}</span>
          <span className="nav-kurz">{p.kurz}</span>
        </Link>
      ))}
    </>
  );
}
