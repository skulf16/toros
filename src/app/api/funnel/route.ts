import { NextRequest, NextResponse } from "next/server";
import { db, getSetting, getFunnelConfig } from "@/lib/db";
import { leadMailSenden } from "@/lib/mail";

/**
 * Nimmt Funnel-Leads entgegen, validiert serverseitig und speichert sie.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, fehler: "Ungültige Anfrage." }, { status: 400 });
  }

  const s = (k: string) => String(body[k] ?? "").trim().slice(0, 300);
  const vorname = s("vorname");
  const nachname = s("nachname");
  const telefon = s("telefon");
  const emailRoh = s("email");
  const kategorie = s("kategorie");
  const klasse = s("klasse");
  const start = s("start");
  const alter = s("alter");
  const referrer = s("referrer").slice(0, 500);
  const consent = body.consent === true || body.consent === "1";

  // Serverseitige Validierung — gleiche Regeln wie im Frontend.
  const ziffern = telefon.replace(/[^\d+]/g, "");
  if (vorname.length < 2 || nachname.length < 2 || ziffern.length < 5) {
    return NextResponse.json(
      { ok: false, fehler: "Bitte Vorname, Nachname und Telefonnummer prüfen." },
      { status: 422 }
    );
  }
  if (!consent) {
    return NextResponse.json(
      { ok: false, fehler: "Bitte der Datenverarbeitung zustimmen." },
      { status: 422 }
    );
  }
  const cfg = getFunnelConfig();
  if (!cfg.kategorien.some((k) => k.id === kategorie)) {
    return NextResponse.json({ ok: false, fehler: "Unbekannte Kategorie." }, { status: 422 });
  }
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRoh) ? emailRoh : "";

  const info = db()
    .prepare(
      `INSERT INTO leads (kategorie, klasse, startwunsch, altersgruppe, vorname, nachname, telefon, email, consent, referrer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`
    )
    .run(kategorie, klasse, start, alter, vorname, nachname, telefon, email, referrer);

  // Benachrichtigung — bewusst nicht blockierend fürs Ergebnis.
  leadMailSenden({
    id: Number(info.lastInsertRowid),
    kategorie,
    klasse,
    start,
    alter,
    vorname,
    nachname,
    telefon,
    email,
  }).catch((e) => console.error("Lead-Mail fehlgeschlagen:", e));

  return NextResponse.json({ ok: true, redirect: "/danke", telefon: getSetting("telefon") });
}
