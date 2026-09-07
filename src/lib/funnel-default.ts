/**
 * Standard-Konfiguration des Führerschein-Check-Funnels.
 * Inhaltlich identisch mit dem bisherigen WordPress-Funnel (v1.3.4) —
 * im Leads-Panel unter /leads/funnel vollständig anpassbar.
 */

export type FunnelOption = {
  id: string;
  label: string;
  desc: string;
  icon: string; // Name aus components/icons.tsx
};

export type FunnelKategorie = {
  id: string;
  label: string;
  desc: string;
  icon: string;
  frage: string; // Frage in Schritt 2
  sub: string;
  optionen: FunnelOption[];
};

export type FunnelConfig = {
  label: string;
  seminarLabel: string;
  schritte: {
    kategorie: { frage: string; sub: string };
    start: { frage: string; sub: string; optionen: FunnelOption[] };
    alter: { frage: string; sub: string; optionen: FunnelOption[] };
    kontakt: { frage: string; sub: string };
  };
  kategorien: FunnelKategorie[];
  texte: Record<string, string>;
};

export const FUNNEL_DEFAULT: FunnelConfig = {
  label: "Führerschein-Check",
  seminarLabel: "Seminar-Check",
  schritte: {
    kategorie: {
      frage: "Was möchtest du machen?",
      sub: "Wähle, was am besten passt — du kannst später anpassen.",
    },
    start: {
      frage: "Wann möchtest du starten?",
      sub: "Wir planen sofort die nächste Gruppe für dich ein.",
      optionen: [
        { id: "sofort", label: "So schnell wie möglich", desc: "Innerhalb der nächsten 7 Tage", icon: "flash" },
        { id: "1-2mon", label: "In 1–2 Monaten", desc: "Ich plane vorausschauend", icon: "cal" },
        { id: "info", label: "Erstmal informieren", desc: "Beratungstermin reicht", icon: "info" },
      ],
    },
    alter: {
      frage: "Wie alt bist du?",
      sub: "Hilft uns bei Klassen- und Terminzuteilung.",
      optionen: [
        { id: "u17", label: "Unter 17", desc: "BF17 oder Motorrad ab 15", icon: "info" },
        { id: "17", label: "17 Jahre", desc: "BF17 möglich", icon: "cal" },
        { id: "18+", label: "18 oder älter", desc: "Alle Pkw-Klassen offen", icon: "check" },
      ],
    },
    kontakt: {
      frage: "Top — wohin senden wir deinen persönlichen Plan?",
      sub: "Du bekommst eine ehrliche Preis-Spannweite und deinen Wunschstart per Mail oder Anruf.",
    },
  },
  kategorien: [
    {
      id: "auto",
      label: "Auto",
      desc: "Klasse B, BF17, B197 oder BE",
      icon: "auto",
      frage: "Welche Pkw-Variante?",
      sub: "Mit B, BF17, B197 oder BE auf die Straße.",
      optionen: [
        { id: "B", label: "Klasse B", desc: "Standard-Pkw, Schalter", icon: "schalt" },
        { id: "B17", label: "BF17", desc: "Begleitetes Fahren — ab 16,5 starten", icon: "bf17" },
        { id: "B197", label: "Klasse B197", desc: "Mit Automatik ausbilden", icon: "automatik" },
        { id: "BE", label: "Klasse BE", desc: "Pkw + schwerer Anhänger", icon: "anhaenger" },
        { id: "B78", label: "Klasse B78", desc: "Nur Automatik", icon: "automatik" },
      ],
    },
    {
      id: "motorrad",
      label: "Motorrad",
      desc: "AM, A1, A2 oder A",
      icon: "moto",
      frage: "Welche Motorradklasse?",
      sub: "Vom Roller bis zur offenen Klasse.",
      optionen: [
        { id: "AM", label: "Klasse AM", desc: "Roller bis 45 km/h", icon: "moto" },
        { id: "A1", label: "Klasse A1", desc: "Leichtkraftrad bis 125 cm³", icon: "moto" },
        { id: "A2", label: "Klasse A2", desc: "Bis 35 kW Leistung", icon: "moto" },
        { id: "A", label: "Klasse A", desc: "Offene Motorradklasse", icon: "moto" },
      ],
    },
    {
      id: "anhaenger",
      label: "Anhänger / Erweiterung",
      desc: "BE, B96 oder Aufstockung",
      icon: "anhaenger",
      frage: "Welche Anhänger-Klasse?",
      sub: "Für Wohnwagen, Pferd, Boot oder Werkstatt.",
      optionen: [
        { id: "BE", label: "Klasse BE", desc: "Schwerer Anhänger", icon: "anhaenger" },
        { id: "B96", label: "B96", desc: "Erweiterung für mittelgroße Anhänger", icon: "anhaenger" },
      ],
    },
    {
      id: "seminar",
      label: "Seminare",
      desc: "ASF, FES oder MPU-Vorbereitung",
      icon: "shield",
      frage: "Welches Seminar passt zu dir?",
      sub: "Wir behandeln alles vertraulich — keine Bewertung, nur Hilfe.",
      optionen: [
        { id: "asf", label: "ASF — Probezeit", desc: "Aufbauseminar nach Verstoß in der Probezeit", icon: "shield" },
        { id: "fes", label: "FES — Punkte abbauen", desc: "Fahreignungsseminar zur Punktereduzierung", icon: "scale" },
        { id: "mpu", label: "MPU-Vorbereitung", desc: "Persönliche Begleitung zur Begutachtung", icon: "brain" },
        { id: "unsure", label: "Beratung gewünscht", desc: "Ich bin mir unsicher und brauche Rat", icon: "info" },
      ],
    },
  ],
  texte: {
    zurueck: "Zurück",
    weiter: "Weiter",
    fastGeschafft: "Fast geschafft",
    absenden: "Plan anfordern",
    danke: "Danke",
    dankeText: "Wir melden uns innerhalb eines Werktags persönlich bei dir.",
    direktAnrufen: "Direkt anrufen",
    fehler: "Etwas ist schiefgegangen. Bitte ruf uns kurz an.",
    deineWahl: "Deine Wahl",
    wann: "Wann?",
    alter: "Alter",
    vorname: "Vorname",
    nachname: "Nachname",
    telefon: "Telefon",
    emailOptional: "E-Mail (optional)",
    vornamePh: "z. B. Lena",
    nachnamePh: "z. B. Schmidt",
    telefonPh: "0151 …",
    emailPh: "mail@deinemail.de",
    consentPre: "Ich habe die ",
    consentLink: "Datenschutzerklärung",
    consentPost: " gelesen und stimme der Verarbeitung meiner Daten zur Kontaktaufnahme zu.",
    klasseFrage: "Welche Klasse genau?",
    klasseSub: "Unsicher? Dann nimm deine erste Vermutung — wir beraten dich danach.",
  },
};
