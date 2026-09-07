import nodemailer from "nodemailer";
import { getSetting } from "./db";

/**
 * Lead-Benachrichtigung per SMTP. Ohne SMTP-Konfiguration (env) wird nur
 * geloggt — Leads liegen unabhängig davon immer im Admin-Bereich.
 *
 * Nötige Umgebungsvariablen: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
 * optional SMTP_FROM (Standard: SMTP_USER).
 */

type LeadDaten = {
  id: number;
  kategorie: string;
  klasse: string;
  start: string;
  alter: string;
  vorname: string;
  nachname: string;
  telefon: string;
  email: string;
};

export async function leadMailSenden(lead: LeadDaten) {
  const host = process.env.SMTP_HOST;
  if (!host) {
    console.log(`[Lead #${lead.id}] Kein SMTP konfiguriert — nur in DB gespeichert.`);
    return;
  }

  const empfaenger = getSetting("lead_empfaenger")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (!empfaenger.length) return;

  const transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  const zeilen = [
    `Neuer Lead über den Führerschein-Check (#${lead.id})`,
    ``,
    `Name:      ${lead.vorname} ${lead.nachname}`,
    `Telefon:   ${lead.telefon}`,
    lead.email ? `E-Mail:    ${lead.email}` : null,
    `Kategorie: ${lead.kategorie}`,
    `Klasse:    ${lead.klasse}`,
    `Start:     ${lead.start}`,
    `Alter:     ${lead.alter}`,
    ``,
    `Alle Leads: /leads`,
  ].filter((z) => z !== null);

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: empfaenger,
    replyTo: lead.email || undefined,
    subject: `Neuer Lead: ${lead.vorname} ${lead.nachname} (${lead.klasse || lead.kategorie})`,
    text: zeilen.join("\n"),
  });
}
