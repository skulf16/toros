import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { FUNNEL_DEFAULT } from "./funnel-default";

/**
 * SQLite-Datenlayer. Die Datei liegt unter ./data/toros.db und wird beim
 * ersten Start automatisch angelegt und mit den Live-Daten befüllt.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "toros.db");

declare global {
  // Verhindert mehrfache Verbindungen bei Hot-Reload im Dev-Modus.
  var __torosDb: Database.Database | undefined;
}

export function db(): Database.Database {
  if (global.__torosDb) return global.__torosDb;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const d = new Database(DB_PATH);
  d.pragma("journal_mode = WAL");
  migrate(d);
  global.__torosDb = d;
  return d;
}

function migrate(d: Database.Database) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS termine (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      datum TEXT NOT NULL,           -- YYYY-MM-DD
      start TEXT NOT NULL,           -- HH:MM
      ende TEXT NOT NULL,            -- HH:MM
      thema TEXT NOT NULL,
      hinweis TEXT NOT NULL DEFAULT '',
      ort TEXT NOT NULL DEFAULT 'Büro Nuthetal'
    );
    CREATE INDEX IF NOT EXISTS idx_termine_datum ON termine(datum);

    CREATE TABLE IF NOT EXISTS themen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      sortierung INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      kategorie TEXT NOT NULL,
      klasse TEXT NOT NULL DEFAULT '',
      startwunsch TEXT NOT NULL DEFAULT '',
      altersgruppe TEXT NOT NULL DEFAULT '',
      vorname TEXT NOT NULL,
      nachname TEXT NOT NULL,
      telefon TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      consent INTEGER NOT NULL DEFAULT 0,
      referrer TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'neu'   -- neu | kontaktiert
    );

    CREATE TABLE IF NOT EXISTS kontakt (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      thema TEXT NOT NULL DEFAULT '',
      vorname TEXT NOT NULL,
      nachname TEXT NOT NULL DEFAULT '',
      alter_jahre TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      telefon TEXT NOT NULL DEFAULT '',
      nachricht TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'neu'
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS galerie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pfad TEXT NOT NULL,              -- z. B. /img/erfolg-01.jpg oder /uploads/erfolg-….jpg
      sortierung INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  seed(d);
}

/* ----------------------------- Settings ----------------------------- */

export const SETTINGS_DEFAULTS: Record<string, string> = {
  telefon: "033200 55 69 46",
  email: "kontakt@fahrschuletoros.de",
  adresse_1: "Arthur-Scheunert-Allee 2",
  adresse_2: "Raum 1.08 und 1.09, 1. OG im Haus 2",
  adresse_ort: "14558 Nuthetal-Potsdam",
  zeiten_1: "Mo–Do: 09:00 – 18:00 Uhr",
  zeiten_2: "Freitag: 09:00 – 16:00 Uhr",
  gtm_id: "GTM-WNWZR3S9",
  heyflow_id: "htE9nlcsxpCvS6sC8UqU",
  anmeldung_url:
    "https://api.fahrschulmanager.de/v1/onlineanmeldung/authenticate?t=9hTxOwLLp18s8ipLXDNBjhkepZlg8GhVk6kVjrLGxvYbBVhov%2Bp39%2FaL3zd59CHoGTBbD2P7oXsaeslhkDK7jw%3D%3D",
  lead_empfaenger: "kontakt@fahrschuletoros.de",
  // Empfänger für den Passwort-Reset des Leads-Panels (Admin-Reset geht an lead_empfaenger)
  leads_reset_empfaenger: "theis@fluks.media",
  // Unterrichtszeiten je Wochentag (1=Mo … 7=So), leer = kein Unterricht
  unterrichtszeiten: JSON.stringify({
    1: { start: "18:00", ende: "19:30" },
    2: { start: "18:00", ende: "19:30" },
    3: { start: "18:00", ende: "19:30" },
    4: { start: "18:00", ende: "19:30" },
    5: { start: "16:00", ende: "17:30" },
    6: { start: "", ende: "" },
    7: { start: "", ende: "" },
  }),
};

export function getSetting(key: string): string {
  const row = db()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as { value: string } | undefined;
  return row?.value ?? SETTINGS_DEFAULTS[key] ?? "";
}

export function setSetting(key: string, value: string) {
  db()
    .prepare(
      "INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    )
    .run(key, value);
}

export type AktionsBanner = {
  /** Steuert nur die schmale Leiste oben — die Aktions-Sektion auf der Startseite ist immer sichtbar. */
  aktiv: boolean;
  /** Kurzfassung für die Leiste oben; verlinkt auf die Sektion (/#anmelden). */
  text: string;
  /** Überschrift der Aktions-Sektion auf der Startseite. */
  titel: string;
  /** Kleine Zeile unter der Überschrift. */
  untertitel: string;
  /** Aufzählungspunkte, eine Zeile pro Punkt. */
  punkte: string;
  /** Hinweiszeile unter dem „Zur Anmeldung“-Button. */
  hinweis: string;
};

export const BANNER_DEFAULT: AktionsBanner = {
  aktiv: false,
  text: "",
  titel: "Neustart 2026",
  untertitel: "Keine Extra-Kosten fürs Lernmaterial",
  punkte: [
    "Grundgebühr & Lernapp inklusive",
    "Garantierte Theorie und Praxis",
    "Start innerhalb von 7 Tagen",
    "Praxisfahrstunden ohne Wartezeit!",
  ].join("\n"),
  hinweis: "Es sind noch Plätze frei",
};

export function getAktionsBanner(): AktionsBanner {
  const raw = getSetting("aktion_banner");
  if (!raw) return BANNER_DEFAULT;
  try {
    return { ...BANNER_DEFAULT, ...(JSON.parse(raw) as Partial<AktionsBanner>) };
  } catch {
    return BANNER_DEFAULT;
  }
}

export function getFunnelConfig() {
  const raw = getSetting("funnel_config");
  if (!raw) return FUNNEL_DEFAULT;
  try {
    return JSON.parse(raw) as typeof FUNNEL_DEFAULT;
  } catch {
    return FUNNEL_DEFAULT;
  }
}

/* ------------------------------- Auth ------------------------------- */

export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const probe = scryptSync(pw, salt, 64);
  const ref = Buffer.from(hash, "hex");
  return probe.length === ref.length && timingSafeEqual(probe, ref);
}

/* ------------------------------- Seed ------------------------------- */

function seed(d: Database.Database) {
  const hatTermine = (
    d.prepare("SELECT COUNT(*) AS n FROM termine").get() as { n: number }
  ).n;
  if (hatTermine === 0) {
    const seedPath = path.join(DATA_DIR, "seed-termine.json");
    if (fs.existsSync(seedPath)) {
      const termine = JSON.parse(fs.readFileSync(seedPath, "utf8")) as Array<{
        datum: string;
        start: string;
        ende: string;
        thema: string;
        hinweis: string;
        ort: string;
      }>;
      const ins = d.prepare(
        "INSERT INTO termine(datum, start, ende, thema, hinweis, ort) VALUES (@datum, @start, @ende, @thema, @hinweis, @ort)"
      );
      const tx = d.transaction((rows: typeof termine) => {
        for (const r of rows) ins.run(r);
      });
      tx(termine);
    }
  }

  const hatThemen = (
    d.prepare("SELECT COUNT(*) AS n FROM themen").get() as { n: number }
  ).n;
  if (hatThemen === 0) {
    const ins = d.prepare(
      "INSERT INTO themen(name, sortierung) VALUES (?, ?)"
    );
    const namen = [
      ...Array.from({ length: 14 }, (_, i) => `Thema ${i + 1}`),
      "Motorrad-Theorie: Thema 1+2",
      "Motorrad-Theorie: Thema 3+4",
    ];
    namen.forEach((n, i) => ins.run(n, i));
  }

  const hatGalerie = (
    d.prepare("SELECT COUNT(*) AS n FROM galerie").get() as { n: number }
  ).n;
  if (hatGalerie === 0) {
    const ins = d.prepare("INSERT INTO galerie(pfad, sortierung) VALUES (?, ?)");
    for (let i = 1; i <= 17; i++) {
      ins.run(`/img/erfolg-${String(i).padStart(2, "0")}.jpg`, i);
    }
  }

  const hatPasswort = d
    .prepare("SELECT value FROM settings WHERE key = 'admin_passwort'")
    .get();
  if (!hatPasswort) {
    const initial = process.env.ADMIN_PASSWORD || "toros2026";
    d.prepare("INSERT INTO settings(key, value) VALUES('admin_passwort', ?)").run(
      hashPassword(initial)
    );
  }

  const hatLeadsPasswort = d
    .prepare("SELECT value FROM settings WHERE key = 'leads_passwort'")
    .get();
  if (!hatLeadsPasswort) {
    const initial = process.env.LEADS_PASSWORD || process.env.ADMIN_PASSWORD || "toros2026";
    d.prepare("INSERT INTO settings(key, value) VALUES('leads_passwort', ?)").run(
      hashPassword(initial)
    );
  }
}
