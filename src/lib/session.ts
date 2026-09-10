import { cookies } from "next/headers";
import { createHmac, randomBytes } from "node:crypto";
import { getSetting, setSetting } from "./db";

/**
 * Minimale, signierte Sessions (HMAC-Cookie) für die zwei geschützten
 * Bereiche: "admin" (Website-Pflege) und "leads" (Leads & Kontaktanfragen).
 * Das Signier-Secret wird beim ersten Start erzeugt und in der DB abgelegt;
 * alternativ per env SESSION_SECRET setzbar.
 *
 * Payload: `bereich:ablauf[:dauerStunden]` — die Dauer steht mit im Token,
 * damit der Proxy eine „Angemeldet bleiben“-Session rollierend um dieselbe
 * Dauer verlängern kann. Alte Zwei-Teile-Tokens gelten als 12-h-Session.
 */

export type Bereich = "admin" | "leads";

export const SESSION_COOKIES: Record<Bereich, string> = {
  admin: "toros_admin",
  leads: "toros_leads",
};
const GUELTIG_STUNDEN = 12;
const GUELTIG_STUNDEN_DAUERHAFT = 90 * 24;

function secret(): string {
  const env = process.env.SESSION_SECRET;
  if (env) return env;
  let s = getSetting("session_secret");
  if (!s) {
    s = randomBytes(32).toString("hex");
    setSetting("session_secret", s);
  }
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function tokenBauen(bereich: Bereich, dauerStunden: number): string {
  const ablauf = Date.now() + dauerStunden * 3600_000;
  const payload = `${bereich}:${ablauf}:${dauerStunden}`;
  return `${payload}.${sign(payload)}`;
}

export function cookieOptionen(dauerStunden: number) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: dauerStunden * 3600,
  } as const;
}

export async function loginSetzen(bereich: Bereich = "admin", dauerhaft = false) {
  const dauer = dauerhaft ? GUELTIG_STUNDEN_DAUERHAFT : GUELTIG_STUNDEN;
  (await cookies()).set(SESSION_COOKIES[bereich], tokenBauen(bereich, dauer), cookieOptionen(dauer));
}

export async function logout(bereich: Bereich = "admin") {
  (await cookies()).delete(SESSION_COOKIES[bereich]);
}

/** Prüft Signatur, Bereich und Ablauf; gibt bei Erfolg die Token-Daten zurück. */
export function tokenPruefen(
  token: string | undefined,
  bereich: Bereich
): { ablauf: number; dauerStunden: number } | null {
  if (!token) return null;
  const punkt = token.lastIndexOf(".");
  if (punkt < 0) return null;
  const payload = token.slice(0, punkt);
  const sig = token.slice(punkt + 1);
  if (sign(payload) !== sig) return null;
  const [b, ablauf, dauer] = payload.split(":");
  if (b !== bereich || Number(ablauf) <= Date.now()) return null;
  return { ablauf: Number(ablauf), dauerStunden: Number(dauer) || GUELTIG_STUNDEN };
}

/**
 * Rollierende Verlängerung: Ist das Token gültig und älter als eine Stunde,
 * kommt ein frisches mit voller Laufzeit zurück (sonst null — nichts zu tun).
 * Wird vom Proxy bei jedem Panel-Aufruf verwendet.
 */
export function tokenErneuern(
  token: string | undefined,
  bereich: Bereich
): { token: string; dauerStunden: number } | null {
  const daten = tokenPruefen(token, bereich);
  if (!daten) return null;
  const alterMs = daten.dauerStunden * 3600_000 - (daten.ablauf - Date.now());
  if (alterMs < 3600_000) return null;
  return { token: tokenBauen(bereich, daten.dauerStunden), dauerStunden: daten.dauerStunden };
}

export async function istEingeloggt(bereich: Bereich = "admin"): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIES[bereich])?.value;
  return tokenPruefen(token, bereich) !== null;
}
