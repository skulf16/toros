"use client";

import { useMemo, useState } from "react";

export type Termin = {
  id: number;
  datum: string; // YYYY-MM-DD
  start: string;
  ende: string;
  thema: string;
  hinweis: string;
  ort: string;
};

const MONATE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];
const WOCHENTAGE_KURZ = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WOCHENTAGE_LANG = [
  "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag",
];

const LEER_TEXT = "Die nächsten Termine werden in Kürze veröffentlicht.";
const INFO_TEXT =
  "Büro Nuthetal: Arthur-Scheunert-Allee 2 · Babelsberg: Großbeerenstraße 75";

function monatsSchluessel(datum: string) {
  return datum.slice(0, 7); // YYYY-MM
}

function monatsTitel(schluessel: string) {
  const [j, m] = schluessel.split("-").map(Number);
  return `${MONATE[m - 1]} ${j}`;
}

/** Kurzname eines Ortes: alles vor dem ersten Komma. */
function ortKurz(ort: string) {
  return ort.split(",", 1)[0].trim();
}

/**
 * Farbvariante eines Termins: "motorrad" (Thema enthält "Motorrad"),
 * "ferienkurs" (Hinweis enthält "Ferienkurs") oder "" für Standard.
 */
function terminVariante(termin: Termin): "" | "motorrad" | "ferienkurs" {
  if (termin.thema.toLowerCase().includes("motorrad")) return "motorrad";
  if (termin.hinweis.toLowerCase().includes("ferienkurs")) return "ferienkurs";
  return "";
}

/** Ostersonntag eines Jahres (anonymer Gregorianischer Algorithmus). */
function ostersonntag(jahr: number): Date {
  const a = jahr % 19;
  const b = Math.floor(jahr / 100);
  const c = jahr % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * m + 114) / 31);
  const tag = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(jahr, monat - 1, tag));
}

function isoDatum(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Gesetzliche Feiertage in Brandenburg für ein Jahr: Datum → Name. */
const feiertagCache = new Map<number, Map<string, string>>();
function feiertage(jahr: number): Map<string, string> {
  const cached = feiertagCache.get(jahr);
  if (cached) return cached;

  const ostern = ostersonntag(jahr);
  const rel = (tage: number) => {
    const d = new Date(ostern);
    d.setUTCDate(d.getUTCDate() + tage);
    return isoDatum(d);
  };

  const map = new Map<string, string>([
    [`${jahr}-01-01`, "Neujahr"],
    [rel(-2), "Karfreitag"],
    [rel(0), "Ostersonntag"],
    [rel(1), "Ostermontag"],
    [`${jahr}-05-01`, "Tag der Arbeit"],
    [rel(39), "Christi Himmelfahrt"],
    [rel(49), "Pfingstsonntag"],
    [rel(50), "Pfingstmontag"],
    [`${jahr}-10-03`, "Tag der Deutschen Einheit"],
    [`${jahr}-10-31`, "Reformationstag"],
    [`${jahr}-12-25`, "1. Weihnachtstag"],
    [`${jahr}-12-26`, "2. Weihnachtstag"],
  ]);
  feiertagCache.set(jahr, map);
  return map;
}

function istFeiertag(datum: string): string | undefined {
  return feiertage(Number(datum.slice(0, 4))).get(datum);
}

export default function Kalender({
  termine,
  heute,
  infoText = INFO_TEXT,
}: {
  termine: Termin[];
  heute: string;
  infoText?: string;
}) {
  const monate = useMemo(() => {
    const map = new Map<string, Termin[]>();
    for (const t of termine) {
      const k = monatsSchluessel(t.datum);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(t);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [termine]);

  // Standard-Reiter: aktueller Monat, wenn er Termine hat, sonst der erste Monat mit Terminen.
  const heutigerMonat = monatsSchluessel(heute);
  const [aktiv, setAktiv] = useState(
    monate.some(([k]) => k === heutigerMonat)
      ? heutigerMonat
      : monate[0]?.[0] ?? heutigerMonat
  );

  if (!monate.length) {
    return (
      <div className="fsk-kalender">
        <p className="fsk-leer">{LEER_TEXT}</p>
      </div>
    );
  }

  return (
    <div className="fsk-kalender fsk-monatsansicht">
      <div className="fsk-monat-tabs" role="tablist" aria-label="Monat wählen">
        {monate.map(([k]) => (
          <button
            key={k}
            type="button"
            role="tab"
            className={`fsk-monat-tab${k === aktiv ? " fsk-aktiv" : ""}`}
            aria-selected={k === aktiv}
            onClick={() => setAktiv(k)}
          >
            {monatsTitel(k)}
          </button>
        ))}
      </div>

      {monate.map(([k, liste]) =>
        k === aktiv ? <Monat key={k} schluessel={k} termine={liste} heute={heute} /> : null
      )}

      {infoText ? (
        <p className="fsk-info">
          <span className="fsk-info-icon" aria-hidden="true">i</span>
          {infoText}
        </p>
      ) : null}
    </div>
  );
}

function Monat({
  schluessel,
  termine,
  heute,
}: {
  schluessel: string;
  termine: Termin[];
  heute: string;
}) {
  const [jahr, monat] = schluessel.split("-").map(Number);
  const erster = new Date(Date.UTC(jahr, monat - 1, 1));
  const tageImMonat = new Date(Date.UTC(jahr, monat, 0)).getUTCDate();
  // Mo=0 … So=6
  const startOffset = (erster.getUTCDay() + 6) % 7;

  const proTag = new Map<string, Termin[]>();
  for (const t of termine) {
    if (!proTag.has(t.datum)) proTag.set(t.datum, []);
    proTag.get(t.datum)!.push(t);
  }

  const zellen: Array<{ tag: number; datum: string } | null> = [];
  for (let i = 0; i < startOffset; i++) zellen.push(null);
  for (let tag = 1; tag <= tageImMonat; tag++) {
    zellen.push({ tag, datum: `${schluessel}-${String(tag).padStart(2, "0")}` });
  }
  while (zellen.length % 7 !== 0) zellen.push(null);

  const wochen: (typeof zellen)[] = [];
  for (let i = 0; i < zellen.length; i += 7) wochen.push(zellen.slice(i, i + 7));

  return (
    <table className="fsk-monat-raster">
      <caption className="fsk-nur-vorlesen">
        Theorieunterricht {monatsTitel(schluessel)}
      </caption>
      <thead>
        <tr>
          {WOCHENTAGE_KURZ.map((w) => (
            <th key={w} scope="col">{w}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {wochen.map((woche, wi) => (
          <tr key={wi}>
            {woche.map((zelle, zi) => {
              if (!zelle) {
                return <td key={zi} className="fsk-zelle-leer" aria-hidden="true" />;
              }
              const eintraege = proTag.get(zelle.datum) ?? [];
              const feiertag = istFeiertag(zelle.datum);
              const [j, m, t] = zelle.datum.split("-");
              const klassen = ["fsk-tag"];
              if (zi >= 5) klassen.push("fsk-wochenende");
              if (zelle.datum === heute) klassen.push("fsk-tag-heute");
              if (!eintraege.length) klassen.push("fsk-ohne-eintrag");
              return (
                <td key={zi} className={klassen.join(" ")}>
                  <span className="fsk-tag-nr">{zelle.tag}</span>
                  <span className="fsk-tag-mobil">
                    {WOCHENTAGE_LANG[zi]}, {t}.{m}.{j}
                  </span>
                  {feiertag ? (
                    <span className="fsk-feiertag-name">{feiertag}</span>
                  ) : null}
                  {eintraege.map((e) => {
                    const variante = terminVariante(e);
                    return (
                      <div
                        key={e.id}
                        className={`fsk-eintrag${variante ? ` fsk-eintrag-${variante}` : ""}`}
                      >
                        {e.start && e.ende ? (
                          <span className="fsk-eintrag-zeit">
                            {e.start} – {e.ende}
                          </span>
                        ) : null}
                        <span className="fsk-eintrag-thema">{e.thema}</span>
                        {e.hinweis ? <span className="fsk-hinweis">{e.hinweis}</span> : null}
                        {e.ort ? (
                          <span className="fsk-eintrag-ort" title={e.ort}>
                            {ortKurz(e.ort)}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
