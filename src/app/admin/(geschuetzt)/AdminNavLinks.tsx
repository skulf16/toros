"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PUNKTE = [
  { href: "/admin/termine", label: "Theorietermine" },
  { href: "/admin/aktionen", label: "Aktions-Banner" },
  { href: "/admin/galerie", label: "Erfolgsgeschichten" },
  { href: "/admin/einstellungen", label: "Einstellungen" },
];

export default function AdminNavLinks() {
  const pfad = usePathname();
  return (
    <>
      {PUNKTE.map((p) => (
        <Link key={p.href} href={p.href} className={pfad.startsWith(p.href) ? "aktiv" : ""}>
          {p.label}
        </Link>
      ))}
    </>
  );
}
