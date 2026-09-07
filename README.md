# Fahrschule Toros — Website (Next.js)

Kompletter Neubau von fahrschuletoros.de als Next.js-Anwendung — ohne WordPress.
Funnel, Theoriekalender und Lead-Verwaltung sind Teil der Anwendung und werden
über einen eigenen **Admin-Bereich** unter `/admin` gepflegt.

## Was drin ist

| Bereich | Beschreibung |
|---|---|
| **Startseite** | Kompletter One-Pager: Hero mit Führerschein-Check, Angebot, Über uns, PKW-/Motorrad-Klassen, Fuhrpark, Erfolgsstories, Team, Seminare, Theoriekalender, Kontaktformular |
| **Landingpages** | `/motorradfuehrerschein-potsdam`, `/anhaenger-fuehrerschein-potsdam`, `/seminare` — mit FAQ, Schema.org und Funnel-Vorauswahl |
| **Funnel** | Mehrstufiger Führerschein-Check. Kategorien, Optionen und alle Texte im Admin editierbar (mit Live-Vorschau). Leads landen in der Datenbank + optional per Mail |
| **Theoriekalender** | Monatsansicht wie bisher, gespeist aus der Termin-Verwaltung im Admin (Einzeltermine, Kursserien Thema 1–14, Uhrzeit-Automatik je Wochentag) |
| **Heyflow** | `/motorrad` bettet den bestehenden Heyflow-Funnel ein (Flow-ID im Admin änderbar) |
| **Admin** | `/admin` — Leads, Kontaktanfragen, Theorietermine, Funnel-Editor, Einstellungen (Stammdaten, Unterrichtszeiten, Passwort) |
| **SEO/DSGVO** | Meta/OG, Schema.org DrivingSchool + FAQPage, Sitemap, robots.txt; Fonts lokal; GTM mit Consent Mode v2 (Standard: abgelehnt) |

## Lokal starten

```bash
npm install
npm run dev
```

→ http://localhost:3000 — beim ersten Start wird `data/toros.db` (SQLite)
automatisch angelegt und mit den echten Theorieterminen (Aug–Dez 2026) befüllt.

**Admin:** http://localhost:3000/admin — Passwort initial `toros2026`
(oder env `ADMIN_PASSWORD` beim ersten Start). **Nach dem ersten Login unter
Einstellungen ändern!**

## Produktion / Deployment

Die App braucht einen **Node.js-Server** (kein reines Static-Hosting) und eine
**beschreibbare `data/`-Ablage** für die SQLite-Datenbank.

```bash
npm run build        # erzeugt .next/standalone (self-contained)
node .next/standalone/server.js
```

Empfohlen: ein kleiner VPS oder Node-fähiges Hosting (Hetzner, netcup, Uberspace,
Railway, Fly.io …) mit Prozessmanager (pm2/systemd) und Reverse-Proxy (Caddy/nginx)
für HTTPS. Wichtig: `data/`-Ordner (Datenbank!) beim Deploy erhalten und ins Backup
aufnehmen. Vercel & Co. funktionieren erst, wenn SQLite gegen eine gehostete DB
(z. B. Turso/Postgres) getauscht wird — `src/lib/db.ts` ist die einzige Stelle.

### Umgebungsvariablen

| Variable | Zweck |
|---|---|
| `SITE_URL` | Öffentliche URL (für Sitemap/robots), z. B. `https://fahrschuletoros.de` |
| `ADMIN_PASSWORD` | Initiales Admin-Passwort (nur beim allerersten Start relevant) |
| `SESSION_SECRET` | Optional: festes Secret für Login-Cookies (sonst automatisch erzeugt) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Optional: Lead-Benachrichtigung per E-Mail. Ohne SMTP liegen Leads nur im Admin |

### Go-Live-Checkliste

1. Deploy + HTTPS einrichten, `SITE_URL` setzen
2. Admin-Passwort ändern (Einstellungen)
3. SMTP-Zugangsdaten setzen, Test-Lead schicken
4. DNS von der alten WordPress-Site umstellen
5. Consent-Tool ergänzen (z. B. Cookiebot/Usercentrics-Snippet im GTM), damit
   Analytics/Ads wieder volle Daten bekommen — bis dahin läuft GTM mit
   Consent Mode „denied“ rechtssicher, aber datenreduziert
6. Alte WordPress-URLs prüfen: `/testfunnel/` und `/danke/` existieren hier als
   `/danke`; WordPress-Pfade wie `/wp-content/...` verschwinden — Google
   crawlt sich das in wenigen Tagen neu über die Sitemap

## Datensicherung

Alles Wichtige liegt in **einer Datei**: `data/toros.db` (Leads, Termine,
Kontaktanfragen, Funnel-Konfiguration, Einstellungen). Regelmäßig sichern.

## Technik

Next.js 16 (App Router, TypeScript), better-sqlite3, nodemailer (optional),
selbst gehostete Schriften (Cairo, Rajdhani). Keine weiteren Laufzeit-Abhängigkeiten,
kein CMS, kein jQuery. Design-Token und Markup entsprechen 1:1 dem bisherigen
Markenauftritt (Mint `#a4f5c9`, Cyan `#54c7e3`, Ink `#142a31`).
