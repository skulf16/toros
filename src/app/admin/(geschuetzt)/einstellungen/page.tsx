import { getSetting, SETTINGS_DEFAULTS } from "@/lib/db";
import { einstellungenSpeichernAction } from "../../actions";

export const metadata = { title: "Einstellungen" };

const FELDER: Array<[string, string]> = [
  ["telefon", "Telefonnummer"],
  ["email", "E-Mail-Adresse"],
  ["lead_empfaenger", "Lead-Empfänger (Mail, kommasepariert)"],
  ["adresse_1", "Adresse (Straße)"],
  ["adresse_2", "Adresse (Zusatz)"],
  ["adresse_ort", "PLZ und Ort"],
  ["zeiten_1", "Öffnungszeiten Zeile 1"],
  ["zeiten_2", "Öffnungszeiten Zeile 2"],
  ["gtm_id", "Google-Tag-Manager-ID (leer = aus)"],
  ["heyflow_id", "Heyflow-Flow-ID (Seite /motorrad)"],
  ["anmeldung_url", "URL Online-Anmeldung (Fahrschulmanager)"],
];

const WOCHENTAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

export default async function EinstellungenSeite({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; fehler?: string }>;
}) {
  const params = await searchParams;

  let zeiten: Record<string, { start: string; ende: string }> = {};
  try {
    zeiten = JSON.parse(getSetting("unterrichtszeiten"));
  } catch {
    zeiten = JSON.parse(SETTINGS_DEFAULTS.unterrichtszeiten);
  }

  return (
    <>
      <h1>Einstellungen</h1>
      {params.ok ? <div className="a-meldung">Gespeichert.</div> : null}
      {params.fehler ? <div className="a-fehler">{params.fehler}</div> : null}

      <form action={einstellungenSpeichernAction}>
        <div className="admin-card">
          <h2>Stammdaten</h2>
          <div className="a-zeile">
            {FELDER.map(([key, label]) => (
              <label key={key}>
                {label}
                <input name={key} defaultValue={getSetting(key)} />
              </label>
            ))}
          </div>
          <p className="a-hinweis">
            Telefon, Adresse und Zeiten erscheinen automatisch überall auf der Website (Footer, Buttons,
            Google-Daten). Lead-Mails brauchen zusätzlich SMTP-Zugangsdaten in der Server-Konfiguration —
            siehe README.
          </p>
        </div>

        <div className="admin-card">
          <h2>Unterrichtszeiten je Wochentag</h2>
          <p className="a-hinweis">
            Diese Zeiten nutzt die Terminverwaltung als Automatik (leer = an dem Tag kein Unterricht).
          </p>
          <div className="a-zeile">
            {WOCHENTAGE.map((name, i) => {
              const wt = String(i + 1);
              return (
                <label key={wt}>
                  {name}
                  <span style={{ display: "flex", gap: ".4rem" }}>
                    <input type="time" name={`zeit_${wt}_start`} defaultValue={zeiten[wt]?.start ?? ""} />
                    <input type="time" name={`zeit_${wt}_ende`} defaultValue={zeiten[wt]?.ende ?? ""} />
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="admin-card">
          <h2>Passwörter</h2>
          <div className="a-zeile">
            <label>
              Neues Admin-Passwort (leer = unverändert)
              <input type="password" name="neues_passwort" autoComplete="new-password" minLength={8} />
            </label>
            <label>
              Neues Passwort fürs Leads-Panel (leer = unverändert)
              <input type="password" name="neues_leads_passwort" autoComplete="new-password" minLength={8} />
            </label>
          </div>
          <p className="a-hinweis">
            Leads und Kontaktanfragen liegen im eigenen Panel unter <a href="/leads">/leads</a> mit
            separatem Passwort.
          </p>
        </div>

        <button className="a-btn a-btn--primaer" type="submit">
          Alles speichern
        </button>
      </form>
    </>
  );
}
