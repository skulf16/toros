"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function LoginSeite() {
  const [state, action, laedt] = useActionState(loginAction, null);

  return (
    <div className="login-shell">
      <div className="login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo.png" alt="Fahrschule Toros" />
        <h1 style={{ fontSize: "1.3rem", textAlign: "center" }}>Admin-Bereich</h1>
        {state?.fehler ? <div className="a-fehler">{state.fehler}</div> : null}
        <form action={action} className="a-form">
          <label>
            Passwort
            <input type="password" name="passwort" required autoFocus autoComplete="current-password" />
          </label>
          <button className="t-btn t-btn--dark" type="submit" disabled={laedt}>
            {laedt ? "Anmelden…" : "Anmelden"}
          </button>
        </form>
        <p className="a-hinweis" style={{ marginTop: "1rem", textAlign: "center" }}>
          <a href="/admin/passwort-reset">Passwort vergessen?</a>
        </p>
      </div>
    </div>
  );
}
