"use client";

import { useActionState } from "react";

/** Ergebnis der Reset-Server-Actions. */
type ResetState = { ok?: string | boolean; fehler?: string } | null;
type ResetAction = (state: ResetState, formData: FormData) => Promise<ResetState>;

/** Schritt 1: Reset-Link per Mail anfordern. */
export function AnfordernFormular({
  anfordernAction,
  loginPfad,
}: {
  anfordernAction: ResetAction;
  loginPfad: string;
}) {
  const [state, action, laedt] = useActionState(anfordernAction, null);

  return (
    <>
      <p className="a-hinweis" style={{ marginBottom: "1rem" }}>
        Wir schicken einen Link zum Zurücksetzen an die hinterlegte Empfänger-Adresse.
      </p>
      {state?.fehler ? <div className="a-fehler">{state.fehler}</div> : null}
      {state?.ok ? (
        <div className="a-meldung">{state.ok}</div>
      ) : (
        <form action={action} className="a-form">
          <button className="t-btn t-btn--dark" type="submit" disabled={laedt}>
            {laedt ? "Wird verschickt…" : "Reset-Link anfordern"}
          </button>
        </form>
      )}
      <p className="a-hinweis" style={{ marginTop: "1rem", textAlign: "center" }}>
        <a href={loginPfad}>Zurück zum Login</a>
      </p>
    </>
  );
}

/** Schritt 2: Über den Link aus der Mail ein neues Passwort setzen. */
export function NeuesPasswortFormular({
  resetAction,
  token,
  loginPfad,
}: {
  resetAction: ResetAction;
  token: string;
  loginPfad: string;
}) {
  const [state, action, laedt] = useActionState(resetAction, null);

  if (state?.ok) {
    return (
      <>
        <div className="a-meldung">Das Passwort wurde geändert.</div>
        <p style={{ textAlign: "center" }}>
          <a className="t-btn t-btn--dark" href={loginPfad}>
            Zum Login
          </a>
        </p>
      </>
    );
  }

  return (
    <>
      {state?.fehler ? <div className="a-fehler">{state.fehler}</div> : null}
      <form action={action} className="a-form">
        <input type="hidden" name="token" value={token} />
        <label>
          Neues Passwort (mind. 8 Zeichen)
          <input type="password" name="passwort" required minLength={8} autoFocus autoComplete="new-password" />
        </label>
        <label>
          Passwort wiederholen
          <input type="password" name="wiederholung" required minLength={8} autoComplete="new-password" />
        </label>
        <button className="t-btn t-btn--dark" type="submit" disabled={laedt}>
          {laedt ? "Wird gespeichert…" : "Passwort speichern"}
        </button>
      </form>
    </>
  );
}
