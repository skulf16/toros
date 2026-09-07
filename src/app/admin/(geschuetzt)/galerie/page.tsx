import { galerieBilder } from "@/lib/queries";
import {
  galerieHochladenAction,
  galerieLoeschenAction,
  galerieVerschiebenAction,
} from "../../actions";

export const metadata = { title: "Erfolgsgeschichten" };

export default async function GalerieSeite({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; fehler?: string }>;
}) {
  const params = await searchParams;
  const bilder = galerieBilder();

  return (
    <>
      <h1>Erfolgsgeschichten-Galerie</h1>
      <p className="a-hinweis">
        Diese Bilder erscheinen auf der Startseite unter „Unsere Erfolgsstories“.
        Neue Bilder werden vorn einsortiert; die Reihenfolge lässt sich mit den
        Pfeilen ändern.
      </p>

      {params.ok ? (
        <div className="a-meldung">
          {Number(params.ok) > 1 ? `${params.ok} Bilder hochgeladen.` : "Bild hochgeladen."}
        </div>
      ) : null}
      {params.fehler ? <div className="a-fehler">{params.fehler}</div> : null}

      <div className="admin-card">
        <h2>Neue Bilder hochladen</h2>
        <form action={galerieHochladenAction} className="a-form">
          <label>
            Bilder auswählen (mehrere möglich)
            <input type="file" name="bilder" multiple required accept="image/jpeg,image/png,image/webp" />
          </label>
          <p className="a-hinweis">JPG, PNG oder WebP, max. 12&nbsp;MB pro Bild. Hochformat wirkt in der Galerie am besten.</p>
          <div>
            <button className="a-btn a-btn--primaer" type="submit">Hochladen</button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>Aktuelle Galerie ({bilder.length} Bilder)</h2>
        <div className="a-galerie">
          {bilder.map((b, i) => (
            <figure key={b.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.pfad} alt={`Galerie-Bild ${i + 1}`} loading="lazy" />
              <figcaption>
                <form action={galerieVerschiebenAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="richtung" value="hoch" />
                  <button className="a-btn" type="submit" disabled={i === 0} title="Nach vorn">←</button>
                </form>
                <form action={galerieVerschiebenAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="richtung" value="runter" />
                  <button className="a-btn" type="submit" disabled={i === bilder.length - 1} title="Nach hinten">→</button>
                </form>
                <form action={galerieLoeschenAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="a-btn a-btn--rot" type="submit">Löschen</button>
                </form>
              </figcaption>
            </figure>
          ))}
        </div>
        {bilder.length === 0 ? (
          <p className="a-hinweis">Noch keine Bilder — die Galerie wird auf der Startseite ausgeblendet.</p>
        ) : null}
      </div>
    </>
  );
}
