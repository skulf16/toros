import type { Metadata } from "next";
import Kalender from "@/components/Kalender";
import CtaBand from "@/components/CtaBand";
import { heuteIso, termineAbMonat } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Theorieplan",
  description:
    "Alle Theorietermine der Fahrschule Toros in Nuthetal-Potsdam im Überblick: Themen 1–14, Ferienkurse und Motorrad-Theorie.",
};

export default function Theorieplan() {
  return (
    <>
      <section className="t-sec page-plain termine">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Termine</span>
            <h1>Theorieplan</h1>
            <p>
              Alle Theorietermine auf einen Blick — Themen 1–14, Ferienkurse und Motorrad-Theorie.
              Komm einfach vorbei, eine Voranmeldung ist nicht nötig.
            </p>
          </div>
          <Kalender termine={termineAbMonat()} heute={heuteIso()} />
        </div>
      </section>
      <CtaBand titel="Fragen zum Theorieplan?" text="Ruf uns an oder starte direkt den Führerschein-Check." />
    </>
  );
}
