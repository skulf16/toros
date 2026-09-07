import { getAktionsBanner } from "@/lib/db";
import { bannerSpeichernAction } from "../../actions";

export const metadata = { title: "Aktions-Banner" };

export default async function AktionenSeite({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; fehler?: string }>;
}) {
  const params = await searchParams;
  const banner = getAktionsBanner();
  const punkte = banner.punkte.split("\n").filter(Boolean);

  return (
    <>
      <h1>Aktions-Banner</h1>
      <p className="a-hinweis">
        Die Aktion erscheint zweimal: als schmale <strong>Leiste ganz oben</strong> auf jeder
        Seite (Kurzfassung, abschaltbar — verlinkt automatisch auf die Aktions-Sektion) und als{" "}
        <strong>Aktions-Sektion auf der Startseite</strong> (lange Fassung mit Überschrift,
        Aufzählung und „Zur Anmeldung“-Button — immer sichtbar).
      </p>

      {params.ok ? <div className="a-meldung">Gespeichert — die Website ist sofort aktuell.</div> : null}
      {params.fehler ? <div className="a-fehler">{params.fehler}</div> : null}

      <form action={bannerSpeichernAction}>
        <div className="admin-card">
          <h2>Leiste oben (Kurzfassung)</h2>
          <label className="a-check" style={{ marginBottom: ".9rem" }}>
            <input type="checkbox" name="aktiv" value="1" defaultChecked={banner.aktiv} />
            Leiste auf der Website anzeigen
          </label>
          <div className="a-form" style={{ maxWidth: "none" }}>
            <label>
              Kurzfassung
              <input
                name="text"
                maxLength={200}
                defaultValue={banner.text}
                placeholder="z. B. Sommeraktion: Lernapp gratis bei Anmeldung bis 31.08."
              />
            </label>
          </div>
          <p className="a-hinweis">
            Die Leiste verlinkt automatisch mit „Mehr erfahren“ auf die Aktions-Sektion der Startseite.
          </p>
        </div>

        <div className="admin-card">
          <h2>Aktions-Sektion auf der Startseite (lange Fassung)</h2>
          <div className="a-form" style={{ maxWidth: "none" }}>
            <div className="a-zeile">
              <label>
                Überschrift
                <input name="titel" maxLength={100} required defaultValue={banner.titel} placeholder="z. B. Sommeraktion 2026" />
              </label>
              <label>
                Zeile unter der Überschrift (optional)
                <input name="untertitel" maxLength={160} defaultValue={banner.untertitel} placeholder="z. B. Keine Extra-Kosten fürs Lernmaterial" />
              </label>
              <label>
                Hinweis unter dem Button (optional)
                <input name="hinweis" maxLength={120} defaultValue={banner.hinweis} placeholder="z. B. Es sind noch Plätze frei" />
              </label>
            </div>
            <label>
              Beschreibung — ein Punkt pro Zeile (max. 8, der letzte wird fett hervorgehoben)
              <textarea name="punkte" rows={6} defaultValue={banner.punkte} placeholder={"Grundgebühr & Lernapp inklusive\nStart innerhalb von 7 Tagen"} />
            </label>
          </div>
        </div>

        <button className="a-btn a-btn--primaer" type="submit">Speichern</button>
      </form>

      <div className="admin-card" style={{ marginTop: "1.4rem" }}>
        <h2>Vorschau</h2>
        <h3 style={{ fontSize: ".9rem", color: "var(--ink-mute)" }}>Leiste oben {banner.aktiv ? "(aktiv)" : "(derzeit ausgeblendet)"}</h3>
        {banner.text ? (
          <div className="aktions-banner" style={{ borderRadius: 10 }}>
            <span>{banner.text}</span>
            <span className="mehr">Mehr erfahren →</span>
          </div>
        ) : (
          <p className="a-hinweis">Noch keine Kurzfassung eingetragen.</p>
        )}
        <h3 style={{ fontSize: ".9rem", color: "var(--ink-mute)", marginTop: "1.2rem" }}>Sektion Startseite</h3>
        <div className="angebot" style={{ borderRadius: 10, padding: "1.2rem" }}>
          <div className="inner" style={{ display: "grid", gap: ".8rem" }}>
            <div>
              <span className="klein">Angebot</span>
              <h2 style={{ fontSize: "1.4rem" }}>{banner.titel}</h2>
              {banner.untertitel ? <p className="klein">{banner.untertitel}</p> : null}
            </div>
            <ul>
              {punkte.map((p, i) => (
                <li key={i}>{i === punkte.length - 1 ? <strong>{p}</strong> : p}</li>
              ))}
            </ul>
            <div className="cta">
              <span className="t-btn t-btn--rot">Zur Anmeldung</span>
              {banner.hinweis ? <span className="hinweis">{banner.hinweis}</span> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
