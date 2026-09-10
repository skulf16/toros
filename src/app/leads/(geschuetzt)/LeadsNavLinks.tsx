"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS: Record<string, React.ReactNode> = {
  inbox: (
    <>
      <path d="M3 13.5 5.5 5h13L21 13.5V19a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19v-5.5Z" />
      <path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  trichter: <path d="M3.5 4.5h17l-6.5 8v6l-4 2.5v-8.5l-6.5-8Z" />,
};

const PUNKTE = [
  { href: "/leads", label: "Leads", kurz: "Leads", icon: "inbox" },
  { href: "/leads/kontakt", label: "Kontaktanfragen", kurz: "Kontakt", icon: "mail" },
  { href: "/leads/funnel", label: "Funnel-Editor", kurz: "Funnel", icon: "trichter" },
];

export default function LeadsNavLinks() {
  const pfad = usePathname();
  return (
    <>
      {PUNKTE.map((p) => (
        <Link
          key={p.href}
          href={p.href}
          className={
            (p.href === "/leads" ? pfad === "/leads" : pfad.startsWith(p.href)) ? "aktiv" : ""
          }
        >
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
