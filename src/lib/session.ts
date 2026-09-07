import { cookies } from "next/headers";
import { createHmac, randomBytes } from "node:crypto";
import { getSetting, setSetting } from "./db";

/**
 * Minimale, signierte Sessions (HMAC-Cookie) für die zwei geschützten
 * Bereiche: "admin" (Website-Pflege) und "leads" (Leads & Kontaktanfragen).
 * Das Signier-Secret wird beim ersten Start erzeugt und in der DB abgelegt;
 * alternativ per env SESSION_SECRET setzbar.
 */

export type Bereich = "admin" | "leads";

const COOKIES: Record<Bereich, string> = {
  admin: "toros_admin",
  leads: "toros_leads",
};
const GUELTIG_STUNDEN = 12;

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

export async function loginSetzen(bereich: Bereich = "admin") {
  const ablauf = Date.now() + GUELTIG_STUNDEN * 3600_000;
  const payload = `${bereich}:${ablauf}`;
  const token = `${payload}.${sign(payload)}`;
  (await cookies()).set(COOKIES[bereich], token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GUELTIG_STUNDEN * 3600,
  });
}

export async function logout(bereich: Bereich = "admin") {
  (await cookies()).delete(COOKIES[bereich]);
}

export async function istEingeloggt(bereich: Bereich = "admin"): Promise<boolean> {
  const token = (await cookies()).get(COOKIES[bereich])?.value;
  if (!token) return false;
  const punkt = token.lastIndexOf(".");
  if (punkt < 0) return false;
  const payload = token.slice(0, punkt);
  const sig = token.slice(punkt + 1);
  if (sign(payload) !== sig) return false;
  const [b, ablauf] = payload.split(":");
  return b === bereich && Number(ablauf) > Date.now();
}
