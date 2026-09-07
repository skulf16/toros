import { db } from "./db";
import type { Termin } from "@/components/Kalender";

export function termineAbMonat(abIsoDatum?: string): Termin[] {
  const ab = (abIsoDatum ?? heuteIso()).slice(0, 7) + "-01";
  return db()
    .prepare("SELECT * FROM termine WHERE datum >= ? ORDER BY datum, start")
    .all(ab) as Termin[];
}

export type GalerieBild = { id: number; pfad: string };

export function galerieBilder(): GalerieBild[] {
  return db()
    .prepare("SELECT id, pfad FROM galerie ORDER BY sortierung, id")
    .all() as GalerieBild[];
}

export function heuteIso(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });
}
