import type { Metadata } from "next";
import { passwortResetAction, passwortResetAnfordernAction } from "../actions";
import { AnfordernFormular, NeuesPasswortFormular } from "@/components/PasswortResetFormulare";

export const metadata: Metadata = {
  title: "Passwort zurücksetzen — Fahrschule Toros",
  robots: { index: false, follow: false },
};

export default async function PasswortResetSeite({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="login-shell">
      <div className="login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo.png" alt="Fahrschule Toros" />
        <h1 style={{ fontSize: "1.3rem", textAlign: "center" }}>Passwort zurücksetzen</h1>
        {token ? (
          <NeuesPasswortFormular resetAction={passwortResetAction} token={token} loginPfad="/admin/login" />
        ) : (
          <AnfordernFormular anfordernAction={passwortResetAnfordernAction} loginPfad="/admin/login" />
        )}
      </div>
    </div>
  );
}
