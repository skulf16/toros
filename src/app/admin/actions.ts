"use server";

import fs from "node:fs";
import path from "node:path";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, getSetting, setSetting, verifyPassword, hashPassword, SETTINGS_DEFAULTS, type AktionsBanner } from "@/lib/db";
import { FUNNEL_DEFAULT, type FunnelConfig } from "@/lib/funnel-default";
import { leadMailSenden, resetMailSenden } from "@/lib/mail";
import { istEingeloggt, loginSetzen, logout } from "@/lib/session";

/** Wirft jede nicht eingeloggte Anfrage raus — Pflicht in jeder Action. */
async function adminPruefen() {
  if (!(await istEingeloggt("admin"))) redirect("/admin/login");
}

/** Zugang zum Leads-Panel (eigenes Passwort, eigener Cookie). */
async function leadsPruefen() {
  if (!(await istEingeloggt("leads"))) redirect("/leads/login");
}

/* ------------------------------ Login ------------------------------ */

export async function loginAction(_: unknown, formData: FormData) {
  const passwort = String(formData.get("passwort") ?? "");
  const gespeichert = getSetting("admin_passwort");
  if (!passwort || !verifyPassword(passwort, gespeichert)) {
    return { fehler: "Falsches Passwort." };
  }
  await loginSetzen("admin");
  redirect("/admin/termine");
}

export async function logoutAction() {
  await logout("admin");
  redirect("/admin/login");
}

export async function leadsLoginAction(_: unknown, formData: FormData) {
  const passwort = String(formData.get("passwort") ?? "");
  const gespeichert = getSetting("leads_passwort");
  if (!passwort || !verifyPassword(passwort, gespeichert)) {
    return { fehler: "Falsches Passwort." };
  }
  await loginSetzen("leads");
  redirect("/leads");
}

export async function leadsLogoutAction() {
  await logout("leads");
  redirect("/leads/login");
}

/* --------------------------- Passwort-Reset ------------------------- */

const RESET_GUELTIG_MIN = 30;

/** Je Bereich: wo Token und Passwort liegen, wohin der Link zeigt, wer die Mail bekommt. */
const RESET_KONFIG = {
  admin: {
    tokenKey: "admin_reset",
    passwortKey: "admin_passwort",
    pfad: "/admin/passwort-reset",
    empfaengerKey: "lead_empfaenger",
    label: "Admin-Bereich",
  },
  leads: {
    tokenKey: "leads_reset",
    passwortKey: "leads_passwort",
    pfad: "/leads/passwort-reset",
    empfaengerKey: "leads_reset_empfaenger",
    label: "Leads-Panel",
  },
} as const;

type ResetBereich = keyof typeof RESET_KONFIG;

function resetTokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function resetAnfordern(bereich: ResetBereich) {
  const konfig = RESET_KONFIG[bereich];
  const token = randomBytes(32).toString("hex");
  setSetting(
    konfig.tokenKey,
    JSON.stringify({ hash: resetTokenHash(token), ablauf: Date.now() + RESET_GUELTIG_MIN * 60_000 })
  );

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3300";
  const link = `${proto}://${host}${konfig.pfad}?token=${token}`;

  const empfaenger = getSetting(konfig.empfaengerKey)
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  try {
    await resetMailSenden(link, RESET_GUELTIG_MIN, empfaenger, konfig.label);
  } catch (e) {
    console.error(`[Passwort-Reset ${konfig.label}] Mail-Versand fehlgeschlagen:`, e);
    return { fehler: "Die E-Mail konnte nicht verschickt werden — bitte später erneut versuchen." };
  }
  return {
    ok: `Der Reset-Link wurde an die hinterlegte Empfänger-Adresse geschickt und ist ${RESET_GUELTIG_MIN} Minuten gültig.`,
  };
}

async function resetDurchfuehren(bereich: ResetBereich, formData: FormData) {
  const konfig = RESET_KONFIG[bereich];
  const token = String(formData.get("token") ?? "");
  const neu = String(formData.get("passwort") ?? "");
  const wiederholung = String(formData.get("wiederholung") ?? "");

  let daten: { hash?: string; ablauf?: number } = {};
  try {
    daten = JSON.parse(getSetting(konfig.tokenKey));
  } catch {
    // kein offener Reset
  }
  const probe = token ? resetTokenHash(token) : "";
  const gueltig =
    !!daten.hash &&
    Number(daten.ablauf) > Date.now() &&
    probe.length === daten.hash.length &&
    timingSafeEqual(Buffer.from(probe), Buffer.from(daten.hash));

  if (!gueltig) {
    return { fehler: "Der Link ist ungültig oder abgelaufen — bitte einen neuen anfordern." };
  }
  if (neu.length < 8) {
    return { fehler: "Das neue Passwort braucht mindestens 8 Zeichen." };
  }
  if (neu !== wiederholung) {
    return { fehler: "Die beiden Passwörter stimmen nicht überein." };
  }

  setSetting(konfig.passwortKey, hashPassword(neu));
  setSetting(konfig.tokenKey, "{}"); // Token ist verbraucht
  return { ok: true };
}

export async function passwortResetAnfordernAction(_: unknown, _formData: FormData) {
  return resetAnfordern("admin");
}

export async function passwortResetAction(_: unknown, formData: FormData) {
  return resetDurchfuehren("admin", formData);
}

export async function leadsPasswortResetAnfordernAction(_: unknown, _formData: FormData) {
  return resetAnfordern("leads");
}

export async function leadsPasswortResetAction(_: unknown, formData: FormData) {
  return resetDurchfuehren("leads", formData);
}

/* ------------------------------ Leads ------------------------------ */

export async function leadStatusAction(formData: FormData) {
  await leadsPruefen();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) === "kontaktiert" ? "kontaktiert" : "neu";
  db().prepare("UPDATE leads SET status = ? WHERE id = ?").run(status, id);
  revalidatePath("/leads");
}

export async function leadLoeschenAction(formData: FormData) {
  await leadsPruefen();
  db().prepare("DELETE FROM leads WHERE id = ?").run(Number(formData.get("id")));
  revalidatePath("/leads");
}

/** Schickt die Benachrichtigungs-Mail zu einem Lead erneut an die Empfänger-Adresse(n). */
export async function leadMailErneutSendenAction(formData: FormData) {
  await leadsPruefen();
  const id = Number(formData.get("id"));
  const lead = db().prepare("SELECT * FROM leads WHERE id = ?").get(id) as
    | {
        id: number;
        kategorie: string;
        klasse: string;
        startwunsch: string;
        altersgruppe: string;
        vorname: string;
        nachname: string;
        telefon: string;
        email: string;
      }
    | undefined;
  if (!lead) {
    redirect("/leads?fehler=" + encodeURIComponent("Lead nicht gefunden."));
  }

  let verschickt = false;
  let fehlgeschlagen = false;
  try {
    verschickt = await leadMailSenden({
      id: lead!.id,
      kategorie: lead!.kategorie,
      klasse: lead!.klasse,
      start: lead!.startwunsch,
      alter: lead!.altersgruppe,
      vorname: lead!.vorname,
      nachname: lead!.nachname,
      telefon: lead!.telefon,
      email: lead!.email,
    });
  } catch (e) {
    console.error(`[Lead #${id}] Erneuter Mail-Versand fehlgeschlagen:`, e);
    fehlgeschlagen = true;
  }

  if (fehlgeschlagen) {
    redirect("/leads?fehler=" + encodeURIComponent("Der Versand ist fehlgeschlagen — bitte später erneut versuchen."));
  }
  if (!verschickt) {
    redirect(
      "/leads?fehler=" +
        encodeURIComponent("Es ist kein Mail-Versand konfiguriert (SMTP bzw. Empfänger-Adresse fehlt).")
    );
  }
  redirect("/leads?ok=" + encodeURIComponent(`Die Mail zu Lead #${id} wurde erneut verschickt.`));
}

export async function kontaktStatusAction(formData: FormData) {
  await leadsPruefen();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) === "kontaktiert" ? "kontaktiert" : "neu";
  db().prepare("UPDATE kontakt SET status = ? WHERE id = ?").run(status, id);
  revalidatePath("/leads/kontakt");
}

export async function kontaktLoeschenAction(formData: FormData) {
  await leadsPruefen();
  db().prepare("DELETE FROM kontakt WHERE id = ?").run(Number(formData.get("id")));
  revalidatePath("/leads/kontakt");
}

/* ----------------------------- Termine ----------------------------- */

function unterrichtszeit(datum: string): { start: string; ende: string } | null {
  try {
    const zeiten = JSON.parse(getSetting("unterrichtszeiten")) as Record<
      string,
      { start: string; ende: string }
    >;
    const wt = ((new Date(datum + "T12:00:00").getDay() + 6) % 7) + 1; // 1=Mo…7=So
    const z = zeiten[String(wt)];
    return z && z.start && z.ende ? z : null;
  } catch {
    return null;
  }
}

export async function terminAnlegenAction(formData: FormData) {
  await adminPruefen();
  const datum = String(formData.get("datum") ?? "");
  const thema = String(formData.get("thema") ?? "").trim();
  let start = String(formData.get("start") ?? "").trim();
  let ende = String(formData.get("ende") ?? "").trim();
  const ort = String(formData.get("ort") ?? "Büro Nuthetal").trim();
  const hinweis = String(formData.get("hinweis") ?? "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum) || !thema) {
    redirect("/admin/termine?fehler=" + encodeURIComponent("Bitte Datum und Thema angeben."));
  }
  if (!start || !ende) {
    const auto = unterrichtszeit(datum);
    if (!auto) {
      redirect(
        "/admin/termine?fehler=" +
          encodeURIComponent(
            "An diesem Wochentag findet regulär kein Unterricht statt — bitte eine abweichende Uhrzeit eintragen."
          )
      );
    }
    start = auto!.start;
    ende = auto!.ende;
  }

  const id = Number(formData.get("id") || 0);
  if (id > 0) {
    db()
      .prepare("UPDATE termine SET datum=?, start=?, ende=?, thema=?, hinweis=?, ort=? WHERE id=?")
      .run(datum, start, ende, thema, hinweis, ort, id);
  } else {
    db()
      .prepare("INSERT INTO termine (datum, start, ende, thema, hinweis, ort) VALUES (?, ?, ?, ?, ?, ?)")
      .run(datum, start, ende, thema, hinweis, ort);
  }
  revalidatePath("/admin/termine");
  revalidatePath("/theorieplan");
  revalidatePath("/");
  redirect("/admin/termine?ok=1");
}

export async function terminLoeschenAction(formData: FormData) {
  await adminPruefen();
  db().prepare("DELETE FROM termine WHERE id = ?").run(Number(formData.get("id")));
  revalidatePath("/admin/termine");
  revalidatePath("/theorieplan");
}

/**
 * Kursserie: legt ab Startdatum fortlaufend Termine für die Themen 1–14 an —
 * an jedem Wochentag mit hinterlegter Unterrichtszeit, Wochenenden werden übersprungen.
 */
export async function serieAnlegenAction(formData: FormData) {
  await adminPruefen();
  const startDatum = String(formData.get("startdatum") ?? "");
  const ort = String(formData.get("ort") ?? "Büro Nuthetal").trim();
  const hinweis = String(formData.get("hinweis") ?? "").trim();
  const proTag = Number(formData.get("pro_tag")) === 2 ? 2 : 1;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDatum)) {
    redirect("/admin/termine?fehler=" + encodeURIComponent("Bitte ein Startdatum wählen."));
  }

  const eintraege: Array<{ datum: string; start: string; ende: string; thema: string }> = [];
  const d = new Date(startDatum + "T12:00:00");
  let thema = 1;
  let sicherung = 0;
  while (thema <= 14 && sicherung < 60) {
    sicherung++;
    const iso = d.toLocaleDateString("sv-SE");
    const zeit = unterrichtszeit(iso);
    if (zeit) {
      const bis = Math.min(thema + proTag - 1, 14);
      const label = proTag === 2 && bis > thema ? `Thema ${thema} + Thema ${bis}` : `Thema ${thema}`;
      eintraege.push({ datum: iso, start: zeit.start, ende: zeit.ende, thema: label });
      thema = bis + 1;
    }
    d.setDate(d.getDate() + 1);
  }

  const ins = db().prepare(
    "INSERT INTO termine (datum, start, ende, thema, hinweis, ort) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const tx = db().transaction(() => {
    for (const e of eintraege) ins.run(e.datum, e.start, e.ende, e.thema, hinweis, ort);
  });
  tx();

  revalidatePath("/admin/termine");
  revalidatePath("/theorieplan");
  redirect("/admin/termine?ok=" + eintraege.length);
}

/* --------------------------- Einstellungen -------------------------- */

export async function einstellungenSpeichernAction(formData: FormData) {
  await adminPruefen();
  for (const key of Object.keys(SETTINGS_DEFAULTS)) {
    if (key === "unterrichtszeiten") continue;
    const wert = formData.get(key);
    if (typeof wert === "string") setSetting(key, wert.trim());
  }
  // Unterrichtszeiten je Wochentag
  const zeiten: Record<string, { start: string; ende: string }> = {};
  for (let wt = 1; wt <= 7; wt++) {
    zeiten[String(wt)] = {
      start: String(formData.get(`zeit_${wt}_start`) ?? "").trim(),
      ende: String(formData.get(`zeit_${wt}_ende`) ?? "").trim(),
    };
  }
  setSetting("unterrichtszeiten", JSON.stringify(zeiten));

  const neuesPw = String(formData.get("neues_passwort") ?? "");
  if (neuesPw) {
    if (neuesPw.length < 8) {
      redirect("/admin/einstellungen?fehler=" + encodeURIComponent("Neues Admin-Passwort: mindestens 8 Zeichen."));
    }
    setSetting("admin_passwort", hashPassword(neuesPw));
  }

  const neuesLeadsPw = String(formData.get("neues_leads_passwort") ?? "");
  if (neuesLeadsPw) {
    if (neuesLeadsPw.length < 8) {
      redirect("/admin/einstellungen?fehler=" + encodeURIComponent("Neues Leads-Passwort: mindestens 8 Zeichen."));
    }
    setSetting("leads_passwort", hashPassword(neuesLeadsPw));
  }
  revalidatePath("/", "layout");
  redirect("/admin/einstellungen?ok=1");
}

/* --------------------------- Aktions-Banner ------------------------- */

export async function bannerSpeichernAction(formData: FormData) {
  await adminPruefen();
  const banner: AktionsBanner = {
    aktiv: formData.get("aktiv") === "1",
    text: String(formData.get("text") ?? "").trim().slice(0, 200),
    titel: String(formData.get("titel") ?? "").trim().slice(0, 100),
    untertitel: String(formData.get("untertitel") ?? "").trim().slice(0, 160),
    punkte: String(formData.get("punkte") ?? "")
      .split("\n")
      .map((z) => z.trim())
      .filter(Boolean)
      .slice(0, 8)
      .join("\n"),
    hinweis: String(formData.get("hinweis") ?? "").trim().slice(0, 120),
  };
  if (banner.aktiv && !banner.text) {
    redirect("/admin/aktionen?fehler=" + encodeURIComponent("Bitte eine Kurzfassung eintragen, bevor die Leiste aktiviert wird."));
  }
  if (!banner.titel) {
    redirect("/admin/aktionen?fehler=" + encodeURIComponent("Bitte eine Überschrift für die Aktions-Sektion eintragen."));
  }
  setSetting("aktion_banner", JSON.stringify(banner));
  revalidatePath("/", "layout");
  redirect("/admin/aktionen?ok=1");
}

/* ------------------------ Erfolgsgeschichten-Galerie ----------------- */

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const BILD_TYPEN: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BILD_BYTES = 12 * 1024 * 1024;

export async function galerieHochladenAction(formData: FormData) {
  await adminPruefen();
  const dateien = formData
    .getAll("bilder")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (dateien.length === 0) {
    redirect("/admin/galerie?fehler=" + encodeURIComponent("Bitte mindestens ein Bild auswählen."));
  }
  for (const f of dateien) {
    if (!BILD_TYPEN[f.type]) {
      redirect("/admin/galerie?fehler=" + encodeURIComponent(`„${f.name}“ ist kein unterstütztes Bildformat (JPG, PNG oder WebP).`));
    }
    if (f.size > MAX_BILD_BYTES) {
      redirect("/admin/galerie?fehler=" + encodeURIComponent(`„${f.name}“ ist größer als 12 MB — bitte verkleinern.`));
    }
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const d = db();
  const minSort = (
    d.prepare("SELECT COALESCE(MIN(sortierung), 0) AS s FROM galerie").get() as { s: number }
  ).s;
  const ins = d.prepare("INSERT INTO galerie(pfad, sortierung) VALUES (?, ?)");

  let sort = minSort;
  for (const f of dateien) {
    const name = `erfolg-${Date.now()}-${randomBytes(4).toString("hex")}.${BILD_TYPEN[f.type]}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(await f.arrayBuffer()));
    ins.run(`/uploads/${name}`, --sort); // neue Bilder erscheinen vorn
  }

  revalidatePath("/");
  revalidatePath("/admin/galerie");
  redirect("/admin/galerie?ok=" + dateien.length);
}

export async function galerieLoeschenAction(formData: FormData) {
  await adminPruefen();
  const id = Number(formData.get("id"));
  const row = db().prepare("SELECT pfad FROM galerie WHERE id = ?").get(id) as
    | { pfad: string }
    | undefined;
  if (row) {
    db().prepare("DELETE FROM galerie WHERE id = ?").run(id);
    if (row.pfad.startsWith("/uploads/")) {
      const datei = path.basename(row.pfad);
      try {
        fs.unlinkSync(path.join(UPLOAD_DIR, datei));
      } catch {
        // Datei fehlt schon — Eintrag ist trotzdem weg.
      }
    }
  }
  revalidatePath("/");
  revalidatePath("/admin/galerie");
}

export async function galerieVerschiebenAction(formData: FormData) {
  await adminPruefen();
  const id = Number(formData.get("id"));
  const richtung = String(formData.get("richtung")) === "hoch" ? "hoch" : "runter";
  const d = db();
  const alle = d
    .prepare("SELECT id, sortierung FROM galerie ORDER BY sortierung, id")
    .all() as Array<{ id: number; sortierung: number }>;
  const i = alle.findIndex((b) => b.id === id);
  const j = richtung === "hoch" ? i - 1 : i + 1;
  if (i >= 0 && j >= 0 && j < alle.length) {
    // Sortierwerte können doppelt sein (Seed) — deshalb komplette Reihenfolge neu nummerieren.
    [alle[i], alle[j]] = [alle[j], alle[i]];
    const upd = d.prepare("UPDATE galerie SET sortierung = ? WHERE id = ?");
    const tx = d.transaction(() => alle.forEach((b, n) => upd.run(n, b.id)));
    tx();
  }
  revalidatePath("/");
  revalidatePath("/admin/galerie");
}

/* ---------------------------- Funnel-Editor ------------------------- */

export async function funnelSpeichernAction(configJson: string) {
  await leadsPruefen();
  let config: FunnelConfig;
  try {
    config = JSON.parse(configJson);
  } catch {
    return { fehler: "Ungültige Konfiguration." };
  }
  if (!Array.isArray(config.kategorien) || config.kategorien.length === 0) {
    return { fehler: "Mindestens eine Kategorie ist nötig." };
  }
  for (const k of config.kategorien) {
    if (!k.id || !k.label || !Array.isArray(k.optionen) || k.optionen.length === 0) {
      return { fehler: `Kategorie „${k.label || k.id}“: ID, Name und mindestens eine Option sind Pflicht.` };
    }
  }
  setSetting("funnel_config", JSON.stringify(config));
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function funnelZuruecksetzenAction() {
  await leadsPruefen();
  setSetting("funnel_config", JSON.stringify(FUNNEL_DEFAULT));
  revalidatePath("/", "layout");
  redirect("/leads/funnel?ok=1");
}
