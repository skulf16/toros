import type { Metadata } from "next";
import Script from "next/script";
import { getSetting } from "@/lib/db";

export const metadata: Metadata = {
  title: "Motorrad — Starte jetzt die Motorradsaison",
  description:
    "Starte jetzt die Motorradsaison bei Fahrschule Toros: Beratung buchen und auf brandneuen Honda-Bikes fahren lernen.",
};

/**
 * Bestehender Heyflow-Funnel — unverändert übernommen (Seite /motorrad/).
 */
export default function MotorradFunnel() {
  const flowId = getSetting("heyflow_id");
  return (
    <section className="heyflow-page">
      {flowId ? (
        <>
          <Script src="https://assets.prd.heyflow.com/builder/widget/latest/webview.js" strategy="afterInteractive" />
          {/* @ts-expect-error Custom Element von Heyflow */}
          <heyflow-wrapper
            flow-id={flowId}
            dynamic-height=""
            scroll-up-on-navigation=""
            style-config='{"width":"1920px"}'
          />
        </>
      ) : (
        <div className="wrap" style={{ paddingBlock: "6rem", color: "#fff" }}>
          <h1>Motorrad-Funnel</h1>
          <p>Keine Heyflow-Flow-ID hinterlegt — im Admin unter Einstellungen eintragen.</p>
        </div>
      )}
    </section>
  );
}
