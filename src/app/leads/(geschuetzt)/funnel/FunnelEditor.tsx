"use client";

import { useState, useTransition } from "react";
import type { FunnelConfig, FunnelKategorie, FunnelOption } from "@/lib/funnel-default";
import { ICON_NAMEN, Icon } from "@/components/icons";
import Funnel from "@/components/Funnel";
import { funnelSpeichernAction } from "@/app/admin/actions";

/**
 * Editor für die Funnel-Konfiguration: Kategorien, Optionen und alle Texte
 * lassen sich anpassen — rechts läuft eine Live-Vorschau mit dem Entwurf.
 */
export default function FunnelEditor({
  start,
  telefon,
}: {
  start: FunnelConfig;
  telefon: string;
}) {
  const [cfg, setCfg] = useState<FunnelConfig>(start);
  const [meldung, setMeldung] = useState<{ art: "ok" | "fehler"; text: string } | null>(null);
  const [speichert, startSpeichern] = useTransition();
  const [vorschauKey, setVorschauKey] = useState(0);

  function patch(aenderung: Partial<FunnelConfig>) {
    setCfg((c) => ({ ...c, ...aenderung }));
  }

  function patchKategorie(index: number, aenderung: Partial<FunnelKategorie>) {
    setCfg((c) => {
      const kategorien = c.kategorien.map((k, i) => (i === index ? { ...k, ...aenderung } : k));
      return { ...c, kategorien };
    });
  }

  function patchOption(kIndex: number, oIndex: number, aenderung: Partial<FunnelOption>) {
    setCfg((c) => {
      const kategorien = c.kategorien.map((k, i) => {
        if (i !== kIndex) return k;
        const optionen = k.optionen.map((o, j) => (j === oIndex ? { ...o, ...aenderung } : o));
        return { ...k, optionen };
      });
      return { ...c, kategorien };
    });
  }

  function speichern() {
    setMeldung(null);
    startSpeichern(async () => {
      const res = await funnelSpeichernAction(JSON.stringify(cfg));
      if (res && "fehler" in res && res.fehler) {
        setMeldung({ art: "fehler", text: res.fehler });
      } else {
        setMeldung({ art: "ok", text: "Gespeichert — der Funnel auf der Website ist sofort aktuell." });
      }
    });
  }

  const feld = (
    wert: string,
    onChange: (v: string) => void,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => <input value={wert} onChange={(e) => onChange(e.target.value)} {...props} />;

  const iconWahl = (wert: string, onChange: (v: string) => void) => (
    <select value={wert} onChange={(e) => onChange(e.target.value)}>
      {ICON_NAMEN.map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 400px", gap: "1.4rem", alignItems: "start" }}>
      <div>
        {meldung ? (
          <div className={meldung.art === "ok" ? "a-meldung" : "a-fehler"}>{meldung.text}</div>
        ) : null}

        <div className="admin-card">
          <h2>Allgemein</h2>
          <div className="a-zeile">
            <label>
              Titel Standard-Funnel
              {feld(cfg.label, (v) => patch({ label: v }))}
            </label>
            <label>
              Titel Seminar-Funnel
              {feld(cfg.seminarLabel, (v) => patch({ seminarLabel: v }))}
            </label>
          </div>
        </div>

        <div className="admin-card">
          <h2>Schritt 1 — Kategorie-Auswahl</h2>
          <div className="a-zeile">
            <label>
              Frage
              {feld(cfg.schritte.kategorie.frage, (v) =>
                patch({ schritte: { ...cfg.schritte, kategorie: { ...cfg.schritte.kategorie, frage: v } } })
              )}
            </label>
            <label>
              Untertitel
              {feld(cfg.schritte.kategorie.sub, (v) =>
                patch({ schritte: { ...cfg.schritte, kategorie: { ...cfg.schritte.kategorie, sub: v } } })
              )}
            </label>
          </div>
        </div>

        {cfg.kategorien.map((k, ki) => (
          <div className="admin-card" key={ki}>
            <h2 style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <span style={{ width: 22, height: 22, display: "inline-grid" }}>
                <Icon name={k.icon} />
              </span>
              Kategorie: {k.label || "(ohne Namen)"}
              <button
                className="a-btn a-btn--rot"
                style={{ marginLeft: "auto" }}
                type="button"
                onClick={() =>
                  confirm(`Kategorie „${k.label}“ wirklich entfernen?`) &&
                  patch({ kategorien: cfg.kategorien.filter((_, i) => i !== ki) })
                }
              >
                Kategorie entfernen
              </button>
            </h2>
            <div className="a-zeile">
              <label>
                Name (Schritt 1)
                {feld(k.label, (v) => patchKategorie(ki, { label: v }))}
              </label>
              <label>
                Beschreibung (Schritt 1)
                {feld(k.desc, (v) => patchKategorie(ki, { desc: v }))}
              </label>
              <label>
                Icon
                {iconWahl(k.icon, (v) => patchKategorie(ki, { icon: v }))}
              </label>
            </div>
            <div className="a-zeile" style={{ marginTop: ".7rem" }}>
              <label>
                Frage in Schritt 2
                {feld(k.frage, (v) => patchKategorie(ki, { frage: v }))}
              </label>
              <label>
                Untertitel in Schritt 2
                {feld(k.sub, (v) => patchKategorie(ki, { sub: v }))}
              </label>
            </div>

            <h3 style={{ marginTop: "1.2rem", fontSize: ".95rem" }}>Antwort-Optionen</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-tabelle">
                <thead>
                  <tr>
                    <th style={{ width: 90 }}>Kürzel</th>
                    <th>Name</th>
                    <th>Beschreibung</th>
                    <th style={{ width: 130 }}>Icon</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {k.optionen.map((o, oi) => (
                    <tr key={oi}>
                      <td>{feld(o.id, (v) => patchOption(ki, oi, { id: v }), { style: { width: 80 } })}</td>
                      <td>{feld(o.label, (v) => patchOption(ki, oi, { label: v }))}</td>
                      <td>{feld(o.desc, (v) => patchOption(ki, oi, { desc: v }))}</td>
                      <td>{iconWahl(o.icon, (v) => patchOption(ki, oi, { icon: v }))}</td>
                      <td>
                        <button
                          className="a-btn a-btn--rot"
                          type="button"
                          title="Option entfernen"
                          onClick={() =>
                            patchKategorie(ki, { optionen: k.optionen.filter((_, j) => j !== oi) })
                          }
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="a-btn"
              type="button"
              style={{ marginTop: ".6rem" }}
              onClick={() =>
                patchKategorie(ki, {
                  optionen: [...k.optionen, { id: "", label: "", desc: "", icon: "info" }],
                })
              }
            >
              + Option hinzufügen
            </button>
          </div>
        ))}

        <button
          className="a-btn"
          type="button"
          onClick={() =>
            patch({
              kategorien: [
                ...cfg.kategorien,
                { id: `kategorie-${cfg.kategorien.length + 1}`, label: "", desc: "", icon: "info", frage: "", sub: "", optionen: [{ id: "", label: "", desc: "", icon: "info" }] },
              ],
            })
          }
        >
          + Kategorie hinzufügen
        </button>

        <div className="admin-card" style={{ marginTop: "1.4rem" }}>
          <h2>Schritt 3 &amp; 4 — Start &amp; Alter</h2>
          {(["start", "alter"] as const).map((s) => (
            <div key={s} style={{ marginBottom: "1rem" }}>
              <div className="a-zeile">
                <label>
                  Frage ({s === "start" ? "Startwunsch" : "Alter"})
                  {feld(cfg.schritte[s].frage, (v) =>
                    patch({ schritte: { ...cfg.schritte, [s]: { ...cfg.schritte[s], frage: v } } })
                  )}
                </label>
                <label>
                  Untertitel
                  {feld(cfg.schritte[s].sub, (v) =>
                    patch({ schritte: { ...cfg.schritte, [s]: { ...cfg.schritte[s], sub: v } } })
                  )}
                </label>
              </div>
              {cfg.schritte[s].optionen.map((o, oi) => (
                <div className="a-zeile" key={oi} style={{ marginTop: ".5rem" }}>
                  <label>
                    Option {oi + 1} — Name
                    {feld(o.label, (v) => {
                      const optionen = cfg.schritte[s].optionen.map((x, j) =>
                        j === oi ? { ...x, label: v } : x
                      );
                      patch({ schritte: { ...cfg.schritte, [s]: { ...cfg.schritte[s], optionen } } });
                    })}
                  </label>
                  <label>
                    Beschreibung
                    {feld(o.desc, (v) => {
                      const optionen = cfg.schritte[s].optionen.map((x, j) =>
                        j === oi ? { ...x, desc: v } : x
                      );
                      patch({ schritte: { ...cfg.schritte, [s]: { ...cfg.schritte[s], optionen } } });
                    })}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h2>Kontakt-Schritt &amp; Texte</h2>
          <div className="a-zeile">
            <label>
              Frage Kontakt-Schritt
              {feld(cfg.schritte.kontakt.frage, (v) =>
                patch({ schritte: { ...cfg.schritte, kontakt: { ...cfg.schritte.kontakt, frage: v } } })
              )}
            </label>
            <label>
              Untertitel Kontakt-Schritt
              {feld(cfg.schritte.kontakt.sub, (v) =>
                patch({ schritte: { ...cfg.schritte, kontakt: { ...cfg.schritte.kontakt, sub: v } } })
              )}
            </label>
          </div>
          <div className="a-zeile" style={{ marginTop: ".7rem" }}>
            {Object.entries(cfg.texte).map(([key, wert]) => (
              <label key={key}>
                {key}
                {feld(wert, (v) => patch({ texte: { ...cfg.texte, [key]: v } }))}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: ".8rem", position: "sticky", bottom: 0, background: "#f2f6f7", padding: ".8rem 0" }}>
          <button className="a-btn a-btn--primaer" type="button" onClick={speichern} disabled={speichert}>
            {speichert ? "Speichert…" : "Funnel speichern"}
          </button>
          <button className="a-btn" type="button" onClick={() => setVorschauKey((k) => k + 1)}>
            Vorschau neu starten
          </button>
        </div>
      </div>

      <div style={{ position: "sticky", top: "1rem" }}>
        <div className="admin-card" style={{ background: "var(--ink-2)" }}>
          <h2 style={{ color: "#fff" }}>Live-Vorschau</h2>
          <Funnel key={vorschauKey + JSON.stringify(cfg).length} config={cfg} telefon={telefon} />
          <p className="a-hinweis" style={{ color: "#c8d6da", marginTop: ".8rem" }}>
            Achtung: Ein Absenden in der Vorschau erzeugt einen echten Lead.
          </p>
        </div>
      </div>
    </div>
  );
}
