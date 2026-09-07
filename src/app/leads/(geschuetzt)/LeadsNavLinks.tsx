"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PUNKTE = [
  { href: "/leads", label: "Leads" },
  { href: "/leads/kontakt", label: "Kontaktanfragen" },
  { href: "/leads/funnel", label: "Funnel-Editor" },
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
          {p.label}
        </Link>
      ))}
    </>
  );
}
