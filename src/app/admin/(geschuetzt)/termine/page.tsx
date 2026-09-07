import { db } from "@/lib/db";
import { heuteIso } from "@/lib/queries";
import type { Termin } from "@/components/Kalender";
import {
  terminAnlegenAction,
  terminLoeschenAction,
  serieAnlegenAction,
} from "../../actions";

export const metadata = { title: "Theorietermine" };

const WT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function formatDatum(iso: string) {
  const d = new Date(iso + "T12:00:00");
  const [j, m, t] = iso.split("-");
  return `${WT[d.getDay()]}, ${t}.${m}.${j}`;
}

export default async function TermineSeite({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; fehler?: string; bearbeiten?: string }>;
}) {
  const params = await searchParams;
  const heute = heuteIso();

  const kommende = db()
    .prepare("SELECT * FROM termine WHERE datum >= ? ORDER BY datum, start LIMIT 300")
    .all(heute) as Termin[];
  const vergangene = (
    db().prepare("SELECT COUNT(*) AS n FROM termine WHERE datum < ?").get(heute) as { n: number }
  ).n;
  const themen = (
    db().prepare("SELECT name FROM themen ORDER BY sortierung").all() as { name: string }[]
  ).map((t) => t.name);

  const bearbeiten = params.bearbeiten
    ? (db().prepare("SELECT * FROM termine WHERE id = ?").get(Number(params.bearbeiten)) as
        | Termin
        | undefined)
    : undefined;

  return (
    <>
      <h1>Theorietermine</h1>

      {params.ok ? (
        <div className="a-meldung">
          {Number(params.ok) > 1 ? `${params.ok} Termine angelegt.` : "Gespeichert."}
        </div>
      ) : null}
      {params.fehler ? <div className="a-fehler">{params.fehler}</div> : null}

      <div className="admin-card">
        <h2>{bearbeiten ? `Termin vom ${formatDatum(bearbeiten.datum)} bearbeiten` : "Neuen Termin anlegen"}</h2>
        <form action={terminAnlegenAction} className="a-form" style={{ maxWidth: "none" }}>
          {bearbeiten ? <input type="hidden" name="id" value={bearbeiten.id} /> : null}
          <div className="a-zeile">
            <label>
              Datum
              <input type="date" name="datum" required defaultValue={bearbeiten?.datum ?? ""} />
            </label>
            <label>
              Thema
              <input name="thema" list="themen-liste" required defaultValue={bearbeiten?.thema ?? ""} placeholder="z. B. Thema 3" />
              <datalist id="themen-liste">
                {themen.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </label>
            <label>
              Ort
              <input name="ort" defaultValue={bearbeiten?.ort ?? "Büro Nuthetal"} />
            </label>
            <label>
              Hinweis (optional)
              <input name="hinweis" placeholder="z. B. Ferienkurs" defaultValue={bearbeiten?.hinweis ?? ""} />
            </label>
            <label>
              Beginn (leer = automatisch)
              <input type="time" name="start" defaultValue={bearbeiten?.start ?? ""} />
            </label>
            <label>
              Ende (leer = automatisch)
              <input type="time" name="ende" defaultValue={bearbeiten?.ende ?? ""} />
            </label>
          </div>
          <p className="a-hinweis">
            Ohne Uhrzeit wird die Unterrichtszeit des Wochentags eingetragen (einstellbar unter
            „Einstellungen“).
          </p>
          <div>
            <button className="a-btn a-btn--primaer" type="submit">
              {bearbeiten ? "Änderungen speichern" : "Termin anlegen"}
            </button>{" "}
            {bearbeiten ? (
              <a className="a-btn" href="/admin/termine">
                Abbrechen
              </a>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>Kursserie anlegen (Thema 1–14)</h2>
        <form action={serieAnlegenAction} className="a-form" style={{ maxWidth: "none" }}>
          <div className="a-zeile">
            <label>
              Startdatum
              <input type="date" name="startdatum" required />
            </label>
            <label>
              Themen pro Termin
              <select name="pro_tag" defaultValue="1">
                <option value="1">1 Thema (Normalkurs)</option>
                <option value="2">2 Themen (Ferienkurs)</option>
              </select>
            </label>
            <label>
              Ort
              <input name="ort" defaultValue="Büro Nuthetal" />
            </label>
            <label>
              Hinweis (optional)
              <input name="hinweis" placeholder="z. B. Ferienkurs" />
            </label>
          </div>
          <p className="a-hinweis">
            Legt ab dem Startdatum fortlaufend Termine für Thema 1–14 an — nur an Wochentagen mit
            hinterlegter Unterrichtszeit.
          </p>
          <div>
            <button className="a-btn a-btn--primaer" type="submit">
              Serie anlegen
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>
          Kommende Termine ({kommende.length})
          <span className="a-hinweis" style={{ fontWeight: 400 }}>
            {" "}
            · {vergangene} vergangene bleiben gespeichert
          </span>
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-tabelle">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Uhrzeit</th>
                <th>Thema</th>
                <th>Ort</th>
                <th>Hinweis</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {kommende.map((t) => (
                <tr key={t.id}>
                  <td>{formatDatum(t.datum)}{t.datum === heute ? " · heute" : ""}</td>
                  <td>
                    {t.start} – {t.ende}
                  </td>
                  <td>
                    <strong>{t.thema}</strong>
                  </td>
                  <td>{t.ort}</td>
                  <td>{t.hinweis || "—"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <a className="a-btn" href={`/admin/termine?bearbeiten=${t.id}`}>
                      Bearbeiten
                    </a>{" "}
                    <form action={terminLoeschenAction} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={t.id} />
                      <button className="a-btn a-btn--rot" type="submit">
                        Löschen
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
