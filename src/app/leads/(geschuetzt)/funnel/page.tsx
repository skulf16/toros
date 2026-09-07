import { getFunnelConfig, getSetting } from "@/lib/db";
import { funnelZuruecksetzenAction } from "@/app/admin/actions";
import FunnelEditor from "./FunnelEditor";

export const metadata = { title: "Funnel-Editor" };

export default async function FunnelAdminSeite({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <h1>Funnel-Editor</h1>
      {params.ok ? <div className="a-meldung">Funnel auf Standard zurückgesetzt.</div> : null}
      <p className="a-hinweis" style={{ marginBottom: "1rem" }}>
        Hier passt du den Führerschein-Check an: Kategorien, Antwort-Optionen und alle Texte.
        Änderungen gelten sofort für die Startseite und alle Landingpages.{" "}
      </p>
      <FunnelEditor start={getFunnelConfig()} telefon={getSetting("telefon")} />
      <form action={funnelZuruecksetzenAction} style={{ marginTop: "1.4rem" }}>
        <button
          className="a-btn a-btn--rot"
          type="submit"
        >
          Auf Standard zurücksetzen
        </button>
      </form>
    </>
  );
}
