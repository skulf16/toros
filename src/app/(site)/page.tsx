import type { Metadata } from "next";
import Link from "next/link";
import Funnel from "@/components/Funnel";
import FunnelLink from "@/components/FunnelLink";
import FuhrparkTabs from "@/components/FuhrparkTabs";
import Kalender from "@/components/Kalender";
import Kontaktformular from "@/components/Kontaktformular";
import { Icon } from "@/components/icons";
import LottieIcon from "@/components/LottieIcon";
import { getAktionsBanner, getFunnelConfig, getSetting } from "@/lib/db";
import { galerieBilder, heuteIso, termineAbMonat } from "@/lib/queries";

export const metadata: Metadata = {
  description:
    "Fahrschule Toros in Nuthetal bei Potsdam: Auto-, Motorrad- und Anhängerführerschein mit modernen Fahrzeugen, Theorie täglich und Ausbildung in 7 Sprachen. Jetzt Führerschein-Check starten!",
};

const TEAM = [
  { bild: "team-ross.jpg", rolle: "GF & Fahrlehrer", name: "Ross", info: "Klassen: B, B197, AM & A", tel: "0163 393 95 67" },
  { bild: "team-gennadiy.jpg", rolle: "Fahrlehrer", name: "Gennadiy", info: "Klassen: B, B197, BE", tel: "0176 847 149 14" },
  { bild: "team-tobias.jpg", rolle: "Fahrlehrer", name: "Tobias", info: "Klassen: B, B197, AM, A", tel: "0176 226 87 657" },
  { bild: "team-dragana.jpg", rolle: "Anmeldung", name: "Dragana", info: "Büro & Organisation", tel: "033200 556946" },
];

export default function Startseite() {
  const telefon = getSetting("telefon");
  const funnelConfig = getFunnelConfig();
  const termine = termineAbMonat();
  const stories = galerieBilder();
  const aktion = getAktionsBanner();

  return (
    <>
      {/* ================= Hero mit Führerschein-Check ================= */}
      <section className="hero" style={{ ["--hero-img" as string]: "url('/img/hero-fahrschule.jpg')" }}>
        <div className="wrap">
          <div>
            <span className="t-pill">Fahrschule Toros</span>
            <h1>Sicher und entspannt zum Führerschein</h1>
            <p className="sub">Dein Weg zum Führerschein in Potsdam &amp; Nuthetal — mit Toros Fahrschule.</p>
            <div className="actions">
              <a className="t-btn" href="#fuhrpark">Unser Fuhrpark</a>
              <a className="t-btn t-btn--ghost" href="#termine">Theorietermine</a>
            </div>
          </div>
          <div className="hero-funnel" id="funnel">
            <Funnel config={funnelConfig} telefon={telefon} />
          </div>
        </div>
      </section>

      {/* ================= Aktion (Pflege im Admin unter „Aktions-Banner“) ================= */}
      <section className="angebot" id="anmelden">
        <div className="wrap inner">
          <div className="t-reveal">
            <span className="klein">Angebot</span>
            <h2>{aktion.titel}</h2>
            {aktion.untertitel ? <p className="klein">{aktion.untertitel}</p> : null}
          </div>
          <ul className="t-reveal" data-delay="1">
            {aktion.punkte.split("\n").filter(Boolean).map((p, i, alle) => (
              <li key={i}>{i === alle.length - 1 ? <strong>{p}</strong> : p}</li>
            ))}
          </ul>
          <div className="cta t-reveal" data-delay="2">
            <a className="t-btn t-btn--rot" href="#kontakt">Zur Anmeldung</a>
            {aktion.hinweis ? <span className="hinweis">{aktion.hinweis}</span> : null}
          </div>
        </div>
      </section>

      {/* ================= Willkommen ================= */}
      <section className="t-sec willkommen" id="ueber-uns">
        <div className="wrap">
          <div className="cols">
            <div className="foto t-reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/willkommen.jpg" alt="Fahrschülerin mit bestandenem Führerschein im Toros-Fahrschulauto" loading="lazy" width={1200} height={800} />
            </div>
            <div className="t-reveal" data-delay="1">
              <span className="t-pill">Willkommen</span>
              <h2>Starte deinen Führerschein bei uns</h2>
              <p>
                Wir sind deine moderne Fahrschule für eine entspannte und erfolgreiche Ausbildung. Egal ob du den
                Autoführerschein (Klasse B) oder die Freiheit auf zwei Rädern (Klasse A) suchst — unser erfahrenes Team
                begleitet dich sicher von der ersten Theorieeinheit bis zur praktischen Prüfung. Wir legen Wert auf
                modernste Lernmethoden und eine ehrliche Ausbildung.
              </p>
              <a className="t-btn t-btn--cyan" href="#kontakt">Jetzt anmelden</a>
            </div>
          </div>

          <div className="usp-row">
            <div className="usp t-reveal">
              <span className="ic"><Icon name="smile" /></span>
              <h3>Wohlfühlfaktor &amp; Spaß am Fahren</h3>
              <p>Lerne mit guter Laune! Unsere Fahrlehrer nehmen dir mit Humor die Prüfungsangst und sorgen dafür, dass du dich bei uns jederzeit bestens aufgehoben fühlst.</p>
            </div>
            <div className="usp t-reveal" data-delay="1">
              <span className="ic"><Icon name="route" /></span>
              <h3>Strukturierte Ausbildung</h3>
              <p>Unsere erfahrenen Fahrlehrer begleiten dich mit Ruhe durch die gesamte Ausbildung — von der ersten Stadtfahrt bis zur Autobahn. Wir bereiten dich gezielt vor, damit du Theorie und Praxis sicher bestehst.</p>
            </div>
            <div className="usp t-reveal" data-delay="2">
              <span className="ic"><Icon name="sprache" /></span>
              <h3>Dein Start ohne Umwege</h3>
              <p>Starte sofort durch! In unseren modernen Fahrzeugen lernst du sicher und komfortabel. Damit du alles perfekt verstehst, bieten wir die Ausbildung in 7 Sprachen an — von Deutsch über Englisch bis Ukrainisch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PKW Führerschein ================= */}
      <section className="t-sec t-sec--cyan" id="pkw-fuehrerschein">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Ausbildungsklassen</span>
            <h2>PKW Führerschein</h2>
          </div>
          <div className="t-grid t-grid--4">
            <article className="t-card klasse-card t-reveal">
              <span className="ic"><LottieIcon name="Jeep-2" /></span>
              <span className="t-pill">Klasse B</span>
              <h3>Der Normale</h3>
              <ul>
                <li>Fahrzeuge bis 3,5 t zulässige Gesamtmasse</li>
                <li>Maximal 8 Sitzplätze + Fahrer</li>
                <li>Auch als BF17: begleitetes Fahren ab 16,5 Jahren</li>
              </ul>
              <FunnelLink className="t-btn" kategorie="auto" klasse="B">Jetzt anmelden</FunnelLink>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="1">
              <span className="ic"><LottieIcon name="Old-Car" /></span>
              <span className="t-pill">Klasse B78</span>
              <h3>Nur Automatik</h3>
              <ul>
                <li>Prüfung auf Automatikfahrzeug</li>
                <li>Du darfst nur Automatikautos fahren</li>
                <li>Schaltwagen sind nicht erlaubt</li>
              </ul>
              <FunnelLink className="t-btn" kategorie="auto" klasse="B78">Jetzt anmelden</FunnelLink>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="2">
              <span className="ic"><LottieIcon name="Vintage-Car" /></span>
              <span className="t-pill">Klasse B197</span>
              <h3>Der Flexible</h3>
              <ul>
                <li>Prüfung wird auf Automatik gemacht</li>
                <li>Mindestens 10 Fahrstunden mit Schaltwagen</li>
                <li>Fahrschule bestätigt, dass du schalten kannst</li>
              </ul>
              <FunnelLink className="t-btn" kategorie="auto" klasse="B197">Jetzt anmelden</FunnelLink>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="3">
              <span className="ic"><LottieIcon name="Van" /></span>
              <span className="t-pill">Klasse BE</span>
              <h3>Mit Hänger</h3>
              <ul>
                <li>Erweiterung für größere Anhänger</li>
                <li>Anhänger bis 3,5 t zulässige Gesamtmasse</li>
              </ul>
              <Link className="t-btn" href="/anhaenger-fuehrerschein-potsdam">Mehr erfahren</Link>
            </article>
          </div>
        </div>
      </section>

      {/* ================= Motorrad Führerschein ================= */}
      <section className="t-sec t-sec--mint" id="motorrad-fuehrerschein">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill t-pill--cyan">Ausbildungsklassen</span>
            <h2>Motorrad Führerschein</h2>
          </div>
          <div className="t-grid t-grid--4">
            <article className="t-card klasse-card t-reveal">
              <span className="ic"><LottieIcon name="Scooter-2" /></span>
              <span className="t-pill">Klasse AM</span>
              <h3>Roller &amp; leichte Zweiräder</h3>
              <ul>
                <li>Mindestalter: 15 Jahre</li>
                <li>Fahrzeuge bis 50 cm³</li>
                <li>Max. 45 km/h</li>
              </ul>
              <FunnelLink className="t-btn t-btn--cyan" kategorie="motorrad" klasse="AM">Jetzt anmelden</FunnelLink>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="1">
              <span className="ic"><LottieIcon name="Bike-1" /></span>
              <span className="t-pill">Klasse A1</span>
              <h3>Leichtkrafträder</h3>
              <ul>
                <li>Mindestalter: 16 Jahre</li>
                <li>Motorräder bis 125 cm³</li>
                <li>Max. 11 kW (15 PS)</li>
              </ul>
              <FunnelLink className="t-btn t-btn--cyan" kategorie="motorrad" klasse="A1">Jetzt anmelden</FunnelLink>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="2">
              <span className="ic"><LottieIcon name="Morden-Bike" /></span>
              <span className="t-pill">Klasse A2</span>
              <h3>Mittlere Motorräder</h3>
              <ul>
                <li>Mindestalter: 18 Jahre</li>
                <li>Motorräder bis 35 kW (48 PS)</li>
                <li>Leistungsgewicht: max. 0,2 kW/kg</li>
              </ul>
              <FunnelLink className="t-btn t-btn--cyan" kategorie="motorrad" klasse="A2">Jetzt anmelden</FunnelLink>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="3">
              <span className="ic"><LottieIcon name="Sports-Bike" /></span>
              <span className="t-pill">Klasse A</span>
              <h3>Offene Motorradklasse</h3>
              <ul>
                <li>Mindestalter: 24 Jahre (Direkteinstieg) oder 20 Jahre mit 2 Jahren A2</li>
                <li>Keine Leistungsbegrenzung</li>
                <li>Alle Motorräder erlaubt</li>
              </ul>
              <FunnelLink className="t-btn t-btn--cyan" kategorie="motorrad" klasse="A">Jetzt anmelden</FunnelLink>
            </article>
          </div>
          <p style={{ textAlign: "center", marginTop: "2.4rem" }} className="t-reveal">
            <Link className="t-btn t-btn--dark" href="/motorradfuehrerschein-potsdam">
              Alles zum Motorradführerschein in Potsdam
            </Link>
          </p>
        </div>
      </section>

      {/* ================= Fuhrpark ================= */}
      <section className="t-sec t-sec--soft" id="fuhrpark">
        <div className="wrap">
          <div className="t-sec-head" style={{ textAlign: "center" }}>
            <span className="t-pill">Unser Fuhrpark</span>
            <h2>Fahren lernen auf Premium-Fahrzeugen</h2>
            <p>
              Mercedes-Benz auf vier Rädern, Honda auf zwei — bei uns übst du auf einem
              der modernsten Fuhrparks der Region.
            </p>
          </div>
          <FuhrparkTabs />
        </div>
      </section>

      {/* ================= Erfolgsstories (Pflege im Admin unter „Erfolgsgeschichten“) ================= */}
      {stories.length > 0 ? (
        <section className="t-sec t-sec--dark">
          <div className="wrap">
            <span className="t-pill">Kundenstimmen</span>
            <h3 style={{ marginTop: "1rem" }}>Unsere Erfolgsstories</h3>
            <div className="stories-grid">
              {stories.map((b) => (
                <figure key={b.id} className="t-reveal">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.pfad}
                    alt="Fahrschüler:in der Fahrschule Toros mit bestandener Prüfung"
                    loading="lazy"
                    width={700}
                    height={875}
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ================= Team ================= */}
      <section className="t-sec team" id="fahrlehrer" style={{ ["--team-img" as string]: "url('/img/bg-team.jpg')" }}>
        <div className="wrap">
          <h2>Deine ausgebildeten Beifahrer</h2>
          <div className="t-grid t-grid--4">
            {TEAM.map((t, i) => (
              <article key={t.name} className="team-card t-reveal" data-delay={String(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/img/${t.bild}`} alt={`${t.name} — ${t.rolle} der Fahrschule Toros`} loading="lazy" width={800} height={906} />
                <div className="info">
                  <span className="t-pill">{t.rolle}</span>
                  <h3>{t.name}</h3>
                  <p>
                    {t.info}
                    <br />
                    Tel: <a href={"tel:" + t.tel.replace(/[^\d+]/g, "")}>{t.tel}</a>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Seminare ================= */}
      <section className="t-sec t-sec--dark" id="seminare">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Seminare</span>
            <h2>Dein Führerschein, unser Ziel!</h2>
          </div>
          <div className="t-grid t-grid--3">
            <article className="t-card seminar-card t-reveal">
              <span className="t-pill">ASF und FES Seminare</span>
              <h3>Deinen Führerschein behalten? Wir helfen dir!</h3>
              <hr />
              <ul>
                <li>Soforthilfe &amp; kompetente Beratung bei Fragen zu deiner Fahrerlaubnis</li>
                <li>Diskrete Unterstützung, um deine Mobilität zu sichern</li>
                <li>Dein starker Partner bei allen behördlichen Auflagen</li>
              </ul>
              <Link className="t-btn" href="/seminare">Jetzt informieren</Link>
            </article>
            <article className="t-card seminar-card t-reveal" data-delay="1">
              <span className="t-pill">(ASF) Gruppenseminar</span>
              <h3>Aufbauseminar für Fahranfänger</h3>
              <hr />
              <ul>
                <li><strong>Effektives Gruppenseminar</strong> in entspannter Atmosphäre</li>
                <li><strong>Feste Termine</strong> für deine schnelle und sichere Planung</li>
                <li><strong>Ohne Prüfungsdruck</strong> gemeinsam zurück auf die sichere Seite</li>
              </ul>
              <Link className="t-btn" href="/seminare#asf">Jetzt anmelden</Link>
            </article>
            <article className="t-card seminar-card t-reveal" data-delay="2">
              <span className="t-pill">FES-Seminar</span>
              <h3>Fahreignungsseminar (Punktabbau)</h3>
              <hr />
              <ul>
                <li><strong>Punkte reduzieren</strong> durch freiwillige Teilnahme am Seminar</li>
                <li><strong>Gezielte Unterstützung</strong> für mehr Sicherheit im Straßenverkehr</li>
                <li><strong>Zukunftsorientiertes Training</strong> für regelkonformes Fahrverhalten</li>
              </ul>
              <Link className="t-btn" href="/seminare#fes">Jetzt anmelden</Link>
            </article>
          </div>
        </div>
      </section>

      {/* ================= Termine ================= */}
      <section className="t-sec termine" id="termine">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Termine</span>
            <h2>Täglich Theorie</h2>
          </div>
          <Kalender termine={termine} heute={heuteIso()} />
        </div>
      </section>

      {/* ================= Kontakt ================= */}
      <section className="t-sec kontakt" id="kontakt" style={{ ["--kontakt-img" as string]: "url('/img/bg-kontakt.jpg')" }}>
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Kontakt</span>
            <h2>Melde dich jetzt an und starte durch</h2>
          </div>
          <div className="form-shell t-reveal">
            <Kontaktformular />
          </div>
        </div>
      </section>
    </>
  );
}
