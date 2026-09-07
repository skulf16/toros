"use client";

import { useState } from "react";

type Fahrzeug = {
  bild: string;
  name: string;
  tag: string;
  detail: string;
};

const AUTOS: Fahrzeug[] = [
  { bild: "fuhrpark-gle.jpg", name: "Mercedes GLE", tag: "Automatik", detail: "Unser Flaggschiff — Oberklasse-SUV für entspannte Fahrstunden" },
  { bild: "fuhrpark-glc.jpg", name: "Mercedes GLC", tag: "Automatik", detail: "Komfortabel & übersichtlich" },
  { bild: "fuhrpark-glb.jpg", name: "Mercedes GLB", tag: "Automatik", detail: "Modernste Assistenzsysteme" },
  { bild: "fuhrpark-t-klasse.jpg", name: "Mercedes T-Klasse", tag: "Schalter", detail: "Für die klassische Ausbildung" },
];

const BIKES: Fahrzeug[] = [
  { bild: "fuhrpark-honda-hornet.jpg", name: "Honda Hornet", tag: "Klasse A", detail: "Kraftvolles Naked Bike für die offene Klasse" },
  { bild: "fuhrpark-honda-a2-1.jpg", name: "Honda A2 Bike", tag: "Klasse A2", detail: "Perfekt für den Einstieg" },
  { bild: "fuhrpark-honda-a2-2.jpg", name: "Honda A2 Bike", tag: "Klasse A2", detail: "Gleich doppelt im Fuhrpark" },
  { bild: "fuhrpark-honda-cb125.jpg", name: "Honda CB 125", tag: "A1 & B196", detail: "Leicht & wendig" },
  { bild: "fuhrpark-roller-a1.jpg", name: "Roller", tag: "Klasse A1", detail: "125er-Feeling" },
  { bild: "fuhrpark-roller-am.jpg", name: "Roller", tag: "Klasse AM", detail: "Ab 15 Jahren" },
];

const STATS = [
  { wert: "10", label: "Fahrzeuge im Einsatz" },
  { wert: "4×", label: "Mercedes-Benz" },
  { wert: "6×", label: "Honda & Roller" },
  { wert: "AM–A", label: "alle Zweiradklassen" },
];

export default function FuhrparkTabs() {
  const [tab, setTab] = useState<"autos" | "bikes">("autos");
  const liste = tab === "autos" ? AUTOS : BIKES;
  const [featured, ...rest] = liste;

  return (
    <div className="fp">
      <ul className="fp-stats" aria-label="Fuhrpark in Zahlen">
        {STATS.map((s) => (
          <li key={s.label}>
            <strong>{s.wert}</strong>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>

      <div className="fp-tabs" role="tablist" aria-label="Fuhrpark">
        <button role="tab" aria-selected={tab === "autos"} onClick={() => setTab("autos")} type="button">
          Autos <span className="fp-tab-anzahl">{AUTOS.length}</span>
        </button>
        <button role="tab" aria-selected={tab === "bikes"} onClick={() => setTab("bikes")} type="button">
          Motorräder <span className="fp-tab-anzahl">{BIKES.length}</span>
        </button>
      </div>

      <div className={`fp-mosaik${tab === "bikes" ? " fp-mosaik--6" : ""}`} role="tabpanel" key={tab}>
        <figure className="fp-karte fp-karte--gross">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/img/${featured.bild}`}
            alt={`${featured.name} (${featured.tag}) der Fahrschule Toros`}
            width={1000}
            height={750}
          />
          <figcaption>
            <span className="fp-tag">{featured.tag}</span>
            <h3>{featured.name}</h3>
            <p>{featured.detail}</p>
          </figcaption>
        </figure>

        {rest.map((f, i) => (
          <figure key={f.bild} className="fp-karte" style={{ animationDelay: `${(i + 1) * 70}ms` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/img/${f.bild}`}
              alt={`${f.name} (${f.tag}) der Fahrschule Toros`}
              loading="lazy"
              width={1000}
              height={750}
            />
            <figcaption>
              <span className="fp-tag">{f.tag}</span>
              <h3>{f.name}</h3>
              <p>{f.detail}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="fp-fussnote">
        Du lernst auf aktuellen Modellen von <strong>Mercedes-Benz</strong> und <strong>Honda</strong> —
        gepflegt, top gewartet und mit moderner Sicherheitsausstattung.
      </p>
    </div>
  );
}
