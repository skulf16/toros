import type { Metadata } from "next";
import { leadsPasswortResetAction, leadsPasswortResetAnfordernAction } from "@/app/admin/actions";
import { AnfordernFormular, NeuesPasswortFormular } from "@/components/PasswortResetFormulare";

export const metadata: Metadata = {
  title: "Passwort zurücksetzen — Leads-Panel",
  robots: { index: false, follow: false },
};

export default async function LeadsPasswortResetSeite({
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
          <NeuesPasswortFormular resetAction={leadsPasswortResetAction} token={token} loginPfad="/leads/login" />
        ) : (
          <AnfordernFormular anfordernAction={leadsPasswortResetAnfordernAction} loginPfad="/leads/login" />
        )}
      </div>
    </div>
  );
}
