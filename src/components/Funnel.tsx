"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FunnelConfig } from "@/lib/funnel-default";
import { Icon } from "./icons";

/**
 * Mehrstufiger Führerschein-Check. Inhalte (Kategorien, Optionen, Texte)
 * kommen aus der Funnel-Konfiguration, die im Admin gepflegt wird.
 */

type Daten = {
  kategorie: string;
  klasse: string;
  start: string;
  alter: string;
  vorname: string;
  nachname: string;
  telefon: string;
  email: string;
  consent: boolean;
};

const LEER: Daten = {
  kategorie: "",
  klasse: "",
  start: "",
  alter: "",
  vorname: "",
  nachname: "",
  telefon: "",
  email: "",
  consent: false,
};

export default function Funnel({
  config,
  telefon,
  prefill = "",
  label,
}: {
  config: FunnelConfig;
  telefon: string;
  prefill?: string;
  label?: string;
}) {
  const hatPrefill = !!config.kategorien.find((k) => k.id === prefill);
  const [schritt, setSchritt] = useState(hatPrefill ? 1 : 0);
  const [daten, setDaten] = useState<Daten>({ ...LEER, kategorie: hatPrefill ? prefill : "" });
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState("");
  const [fertig, setFertig] = useState(false);
  const router = useRouter();

  // Vorauswahl von außen (z. B. „Jetzt anmelden“ an den Führerschein-Karten):
  // Event mit {kategorie, klasse} springt in den passenden Schritt.
  useEffect(() => {
    function onPrefill(e: Event) {
      const detail = (e as CustomEvent<{ kategorie?: string; klasse?: string }>).detail ?? {};
      const kat = config.kategorien.find((k) => k.id === detail.kategorie);
      if (!kat) return;
      const klasse = kat.optionen.find((o) => o.id === detail.klasse)?.id ?? "";
      setDaten({ ...LEER, kategorie: kat.id, klasse });
      setSchritt(klasse ? 2 : 1);
      setFertig(false);
      setFehler("");
    }
    window.addEventListener("toros-funnel-prefill", onPrefill);
    return () => window.removeEventListener("toros-funnel-prefill", onPrefill);
  }, [config]);

  const t = config.texte;
  const kategorie = config.kategorien.find((k) => k.id === daten.kategorie);
  const gesamt = 5;

  const kontaktGueltig = useMemo(() => {
    const ziffern = daten.telefon.replace(/[^\d+]/g, "");
    return (
      daten.vorname.trim().length >= 2 &&
      daten.nachname.trim().length >= 2 &&
      ziffern.length >= 5 &&
      daten.consent
    );
  }, [daten]);

  function waehle(feld: keyof Daten, wert: string) {
    const vonSchritt = schritt;
    setDaten((d) => ({ ...d, [feld]: wert }));
    // Auto-Advance wie im Original — aber pro Schritt nur einmal,
    // damit ein Doppelklick keinen Schritt überspringt.
    window.setTimeout(
      () => setSchritt((s) => (s === vonSchritt ? Math.min(s + 1, gesamt - 1) : s)),
      280
    );
  }

  async function absenden() {
    setLaedt(true);
    setFehler("");
    try {
      const res = await fetch("/api/funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...daten, referrer: document.referrer || "" }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setFertig(true);
        window.setTimeout(() => router.push("/danke"), 1200);
      } else {
        setFehler(json.fehler || t.fehler);
      }
    } catch {
      setFehler(t.fehler);
    } finally {
      setLaedt(false);
    }
  }

  const klasseLabel =
    kategorie?.optionen.find((o) => o.id === daten.klasse)?.label ?? "—";
  const startLabel =
    config.schritte.start.optionen.find((o) => o.id === daten.start)?.label ?? "—";
  const alterLabel =
    config.schritte.alter.optionen.find((o) => o.id === daten.alter)?.label ?? "—";

  function optionsGrid(
    optionen: { id: string; label: string; desc: string; icon: string }[],
    feld: keyof Daten
  ) {
    return (
      <div className={`ftf-opts${optionen.length === 1 ? " is-single" : ""}`}>
        {optionen.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`ftf-opt${daten[feld] === o.id ? " is-selected" : ""}`}
            onClick={() => waehle(feld, o.id)}
          >
            <span className="ftf-opt-ic">
              <Icon name={o.icon} />
            </span>
            <span className="ftf-opt-lbl">
              {o.label}
              {o.desc ? <small>{o.desc}</small> : null}
            </span>
          </button>
        ))}
      </div>
    );
  }

  let inhalt: React.ReactNode;
  let weiterAktiv = false;

  if (fertig) {
    inhalt = (
      <div className="ftf-success">
        <div className="ftf-ring">
          <Icon name="check" />
        </div>
        <h3>
          {t.danke}
          {daten.vorname ? `, ${daten.vorname}` : ""}!
        </h3>
        <p>
          {t.dankeText}
          {klasseLabel !== "—" ? (
            <>
              <br />
              {t.deineWahl}: <strong style={{ color: "var(--cyan-deep)" }}>{klasseLabel}</strong>
            </>
          ) : null}
        </p>
        {telefon ? (
          <a className="ftf-phone" href={"tel:" + telefon.replace(/[^\d+]/g, "")}>
            <Icon name="phone" /> {t.direktAnrufen}
          </a>
        ) : null}
      </div>
    );
  } else if (schritt === 0) {
    inhalt = (
      <>
        <div className="ftf-q">{config.schritte.kategorie.frage}</div>
        <div className="ftf-sub">{config.schritte.kategorie.sub}</div>
        {optionsGrid(
          config.kategorien.map((k) => ({ id: k.id, label: k.label, desc: k.desc, icon: k.icon })),
          "kategorie"
        )}
      </>
    );
    weiterAktiv = !!daten.kategorie;
  } else if (schritt === 1) {
    inhalt = (
      <>
        <div className="ftf-q">{kategorie?.frage || t.klasseFrage}</div>
        <div className="ftf-sub">{kategorie?.sub || t.klasseSub}</div>
        {optionsGrid(kategorie?.optionen ?? [], "klasse")}
      </>
    );
    weiterAktiv = !!daten.klasse;
  } else if (schritt === 2) {
    inhalt = (
      <>
        <div className="ftf-q">{config.schritte.start.frage}</div>
        <div className="ftf-sub">{config.schritte.start.sub}</div>
        {optionsGrid(config.schritte.start.optionen, "start")}
      </>
    );
    weiterAktiv = !!daten.start;
  } else if (schritt === 3) {
    inhalt = (
      <>
        <div className="ftf-q">{config.schritte.alter.frage}</div>
        <div className="ftf-sub">{config.schritte.alter.sub}</div>
        {optionsGrid(config.schritte.alter.optionen, "alter")}
      </>
    );
    weiterAktiv = !!daten.alter;
  } else {
    const feld = (
      name: keyof Daten,
      lbl: string,
      ph: string,
      typ: string = "text"
    ) => (
      <div className="ftf-field">
        <label htmlFor={`ftf-${name}`}>{lbl}</label>
        <input
          id={`ftf-${name}`}
          type={typ}
          placeholder={ph}
          value={String(daten[name])}
          onChange={(e) => setDaten((d) => ({ ...d, [name]: e.target.value }))}
        />
      </div>
    );
    inhalt = (
      <>
        <div className="ftf-q">{config.schritte.kontakt.frage}</div>
        <div className="ftf-sub">{config.schritte.kontakt.sub}</div>
        <div className="ftf-summary">
          <div className="ftf-summary-ln">
            <span>{t.deineWahl}</span>
            <strong>{klasseLabel}</strong>
          </div>
          <div className="ftf-summary-ln">
            <span>{t.wann}</span>
            <strong>{startLabel}</strong>
          </div>
          <div className="ftf-summary-ln">
            <span>{t.alter}</span>
            <strong>{alterLabel}</strong>
          </div>
        </div>
        {feld("vorname", t.vorname, t.vornamePh)}
        {feld("nachname", t.nachname, t.nachnamePh)}
        {feld("telefon", t.telefon, t.telefonPh, "tel")}
        {feld("email", t.emailOptional, t.emailPh, "email")}
        <label className="ftf-check">
          <input
            type="checkbox"
            checked={daten.consent}
            onChange={(e) => setDaten((d) => ({ ...d, consent: e.target.checked }))}
          />
          <span>
            {t.consentPre}
            <a href="/datenschutz" target="_blank" rel="noopener">
              {t.consentLink}
            </a>
            {t.consentPost}
          </span>
        </label>
        {fehler ? <div className="ftf-error">{fehler}</div> : null}
      </>
    );
    weiterAktiv = kontaktGueltig && !laedt;
  }

  const istLetzter = schritt === gesamt - 1;

  return (
    <div className="ftf-funnel">
      <div className="ftf-card">
        <div className="ftf-head">
          <span className="ftf-lbl">{label || config.label}</span>
          <div className="ftf-progress" aria-hidden="true">
            <i style={{ width: `${((fertig ? gesamt : schritt + 1) / gesamt) * 100}%` }} />
          </div>
          <span className="ftf-count">
            {Math.min(schritt + 1, gesamt)}/{gesamt}
          </span>
        </div>

        <div className="ftf-body" aria-live="polite">
          {inhalt}
        </div>

        {!fertig ? (
          <div className="ftf-foot">
            <button
              className="ftf-back"
              type="button"
              style={{ visibility: schritt === 0 ? "hidden" : "visible" }}
              onClick={() => setSchritt((s) => Math.max(0, s - 1))}
            >
              ← {t.zurueck}
            </button>
            <button
              className="ftf-next"
              type="button"
              disabled={!weiterAktiv}
              onClick={() => (istLetzter ? absenden() : setSchritt((s) => s + 1))}
            >
              {laedt ? "…" : istLetzter ? t.absenden : schritt === gesamt - 2 ? t.fastGeschafft : t.weiter}{" "}
              →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
