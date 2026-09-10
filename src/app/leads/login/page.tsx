"use client";

import { useActionState } from "react";
import { leadsLoginAction } from "@/app/admin/actions";

export default function LeadsLoginSeite() {
  const [state, action, laedt] = useActionState(leadsLoginAction, null);

  return (
    <div className="login-shell">
      <div className="login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo.png" alt="Fahrschule Toros" />
        <h1 style={{ fontSize: "1.3rem", textAlign: "center" }}>Leads-Panel</h1>
        {state?.fehler ? <div className="a-fehler">{state.fehler}</div> : null}
        <form action={action} className="a-form">
          <label>
            Passwort
            <input type="password" name="passwort" required autoFocus autoComplete="current-password" />
          </label>
          <label className="a-check">
            <input type="checkbox" name="dauerhaft" value="1" defaultChecked />
            Angemeldet bleiben (90 Tage)
          </label>
          <button className="t-btn t-btn--dark" type="submit" disabled={laedt}>
            {laedt ? "Anmelden…" : "Anmelden"}
          </button>
        </form>
        <p className="a-hinweis" style={{ marginTop: "1rem", textAlign: "center" }}>
          <a href="/leads/passwort-reset">Passwort vergessen?</a>
        </p>
      </div>
    </div>
  );
}
