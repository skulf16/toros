import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, fehler: "Ungültige Anfrage." }, { status: 400 });
  }
  const s = (k: string, max = 300) => String(body[k] ?? "").trim().slice(0, max);

  const vorname = s("vorname");
  const nachname = s("nachname");
  const email = s("email");
  const telefon = s("telefon");

  if (vorname.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, fehler: "Bitte Name und E-Mail-Adresse prüfen." },
      { status: 422 }
    );
  }
  if (body.consent !== "1" && body.consent !== true) {
    return NextResponse.json(
      { ok: false, fehler: "Bitte der Datenverarbeitung zustimmen." },
      { status: 422 }
    );
  }

  db()
    .prepare(
      `INSERT INTO kontakt (thema, vorname, nachname, alter_jahre, email, telefon, nachricht)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(s("thema"), vorname, nachname, s("alter", 10), email, telefon, s("nachricht", 5000));

  return NextResponse.json({ ok: true });
}
