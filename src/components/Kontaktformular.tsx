"use client";

import { useState } from "react";

/**
 * Kontaktformular (Ersatz für das bisherige WS-Form-Formular) —
 * gleiche Felder, Anfragen landen im Admin unter „Kontaktanfragen“.
 */
export default function Kontaktformular() {
  const [status, setStatus] = useState<"leer" | "laedt" | "ok" | "fehler">("leer");
  const [meldung, setMeldung] = useState("");

  async function absenden(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("laedt");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("fehler");
        setMeldung(json.fehler || "Das hat nicht geklappt — bitte ruf uns an.");
      }
    } catch {
      setStatus("fehler");
      setMeldung("Das hat nicht geklappt — bitte ruf uns an.");
    }
  }

  if (status === "ok") {
    return (
      <div className="kform">
        <div className="ok">Danke für deine Nachricht! Wir melden uns innerhalb eines Werktags.</div>
      </div>
    );
  }

  return (
    <form className="kform" onSubmit={absenden}>
      <select name="thema" defaultValue="" aria-label="Thema auswählen">
        <option value="" disabled>
          Thema auswählen…
        </option>
        <option>PKW Führerschein</option>
        <option>Motorrad Führerschein</option>
        <option>Anhänger / BE / B96</option>
        <option>Seminare (ASF / FES / MPU)</option>
        <option>Sonstiges</option>
      </select>
      <div className="zeile">
        <input name="vorname" placeholder="Vorname*" required minLength={2} />
        <input name="nachname" placeholder="Nachname*" required minLength={2} />
        <input name="alter" placeholder="Alter" inputMode="numeric" />
      </div>
      <div className="zeile2">
        <input name="email" type="email" placeholder="E-Mail-Adresse*" required />
        <input name="telefon" type="tel" placeholder="Telefon*" required minLength={5} />
      </div>
      <textarea name="nachricht" placeholder="Deine Nachricht & Fragen" />
      <label className="consent">
        <input type="checkbox" name="consent" value="1" required />
        <span>
          Ich erkläre mich mit der Verarbeitung meiner eingegebenen Daten sowie mit der{" "}
          <a href="/datenschutz" target="_blank" rel="noopener" style={{ color: "var(--mint)" }}>
            Datenschutzerklärung
          </a>{" "}
          einverstanden.
        </span>
      </label>
      {status === "fehler" ? <div className="ftf-error">{meldung}</div> : null}
      <button className="t-btn t-btn--cyan" type="submit" disabled={status === "laedt"}>
        {status === "laedt" ? "Wird gesendet…" : "Senden"}
      </button>
    </form>
  );
}
