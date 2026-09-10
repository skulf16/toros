import nodemailer from "nodemailer";
import { getSetting } from "./db";

/**
 * Lead-Benachrichtigung per SMTP. Ohne SMTP-Konfiguration (env) wird nur
 * geloggt — Leads liegen unabhängig davon immer im Admin-Bereich.
 *
 * Nötige Umgebungsvariablen: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
 * optional SMTP_FROM (Standard: SMTP_USER).
 */

function transportErstellen(host: string) {
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

/**
 * Schickt einen Passwort-Reset-Link an die konfigurierten Empfänger.
 * Ohne SMTP wird der Link nur in das Server-Log geschrieben — dort kann
 * er im Notfall abgelesen werden.
 */
export async function resetMailSenden(
  link: string,
  gueltigMinuten: number,
  empfaenger: string[],
  bereichLabel: string
) {
  const host = process.env.SMTP_HOST;
  if (!host) {
    console.log(`[Passwort-Reset ${bereichLabel}] Kein SMTP konfiguriert — Reset-Link: ${link}`);
    return;
  }
  if (!empfaenger.length) {
    console.log(`[Passwort-Reset ${bereichLabel}] Keine Empfänger-Adresse hinterlegt — Reset-Link: ${link}`);
    return;
  }

  await transportErstellen(host).sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: empfaenger,
    subject: `Fahrschule Toros: Passwort für ${bereichLabel} zurücksetzen`,
    text: [
      `Für den Bereich „${bereichLabel}“ der Website wurde ein Passwort-Reset angefordert.`,
      "",
      `Neues Passwort setzen: ${link}`,
      "",
      `Der Link ist ${gueltigMinuten} Minuten gültig und funktioniert nur einmal.`,
      "Wenn Sie das nicht angefordert haben, können Sie diese Mail ignorieren — das Passwort bleibt unverändert.",
    ].join("\n"),
  });
}

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

/** Liefert true, wenn die Mail wirklich verschickt wurde (SMTP und Empfänger vorhanden). */
export async function leadMailSenden(lead: LeadDaten): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  if (!host) {
    console.log(`[Lead #${lead.id}] Kein SMTP konfiguriert — nur in DB gespeichert.`);
    return false;
  }

  const empfaenger = getSetting("lead_empfaenger")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (!empfaenger.length) return false;

  const transport = transportErstellen(host);

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
  return true;
}
