import type { Metadata } from "next";
import Link from "next/link";
import Funnel from "@/components/Funnel";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import { Icon } from "@/components/icons";
import LottieIcon from "@/components/LottieIcon";
import { getFunnelConfig, getSetting } from "@/lib/db";

export const metadata: Metadata = {
  title: "Motorradführerschein Potsdam — AM, A1, A2 & A",
  description:
    "Motorradführerschein in Potsdam & Nuthetal: AM, A1, A2 und A auf neuen Honda-Bikes. Feste Theorietermine, faire Preise, Beratung ohne Wartezeit. Jetzt starten!",
};

export default function MotorradLanding() {
  const telefon = getSetting("telefon");
  const telefonRaw = telefon.replace(/[^\d+]/g, "");

  return (
    <>
      {/* ================= Hero ================= */}
      <section className="hero-sub" style={{ ["--hero-img" as string]: "url('/img/hero-motorrad.jpg')" }}>
        <div className="wrap">
          <span className="t-pill">Motorrad Führerschein</span>
          <h1>Motorradführerschein in Potsdam &amp; Nuthetal</h1>
          <p className="sub">
            Vom Roller bis zur offenen Klasse A: Bei Toros lernst du das Motorradfahren auf brandneuen
            Honda-Maschinen — mit Fahrlehrern, die selbst leidenschaftlich auf zwei Rädern unterwegs sind.
          </p>
          <div className="actions">
            <a className="t-btn" href="#funnel">Jetzt Beratung starten</a>
            <a className="t-btn t-btn--ghost" href={`tel:${telefonRaw}`}>
              <Icon name="phone" /> {telefon}
            </a>
          </div>
        </div>
      </section>

      {/* ================= Intro ================= */}
      <section className="t-sec">
        <div className="wrap info-split">
          <div className="t-reveal">
            <span className="t-pill">Zwei Räder, ein Ziel</span>
            <h2>Deine Motorrad-Fahrschule für Potsdam und Umgebung</h2>
            <p>
              Du willst den Motorradführerschein machen — in Potsdam, Nuthetal oder im Umland? Dann bist du
              bei uns richtig. Unsere Fahrschule liegt in Nuthetal, direkt vor den Toren Potsdams, und die
              Übungsstrecken kennst du später von deinen ersten eigenen Touren: Landstraßen durch den
              Fläming, die Autobahnen rund um Potsdam und der Stadtverkehr, in dem du souverän werden willst.
            </p>
            <p>
              Geschult wird auf einem brandneuen Honda-Fuhrpark: die Hornet für die offene Klasse A, zwei
              A2-Maschinen, die CB 125 für A1 und B196 sowie Roller für AM. Alle Maschinen kannst du dir im{" "}
              <Link href="/#fuhrpark">Fuhrpark auf der Startseite</Link> ansehen. Die Motorrad-Theorie läuft
              nach festem Plan — wann welches Thema dran ist, steht im <Link href="/theorieplan">Theorieplan</Link>.
            </p>
            <p>
              Und weil ehrliche Beratung bei uns vor dem Verkauf kommt: Wir sagen dir am Telefon oder nach dem
              Funnel klar, welche Klasse zu dir passt und was auf dich zukommt — ohne Kleingedrucktes.
            </p>
          </div>
          <div className="t-card t-reveal" data-delay="1">
            <h3>Darum Motorrad bei Toros</h3>
            <ul className="check-list">
              <li>Brandneue Honda-Bikes für jede Klasse — von der CB 125 bis zur Hornet</li>
              <li>Fahrlehrer, die selbst Motorrad fahren und wissen, worauf es ankommt</li>
              <li>Übungsgebiet rund um Potsdam &amp; Nuthetal: Stadt, Landstraße, Autobahn</li>
              <li>Motorrad-Theorie nach festem <Link href="/theorieplan">Theorieplan</Link></li>
              <li>Ausbildung auch als Aufstieg: A1 → A2 → A</li>
              <li>Transparente Preisauskunft am Telefon — keine versteckten Kosten</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= Klassen ================= */}
      <section className="t-sec t-sec--mint" id="klassen">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill t-pill--cyan">Ausbildungsklassen</span>
            <h2>Welche Motorradklasse passt zu dir?</h2>
            <p>Vom ersten Roller mit 15 bis zur offenen Klasse ohne Leistungsgrenze — wir bilden alle Zweiradklassen aus.</p>
          </div>
          <div className="t-grid t-grid--4">
            <article className="t-card klasse-card t-reveal">
              <span className="ic"><LottieIcon name="Scooter-2" /></span>
              <span className="t-pill">Klasse AM</span>
              <h3>Roller &amp; Mopeds</h3>
              <ul>
                <li>Ab 15 Jahren</li>
                <li>Roller &amp; leichte Zweiräder bis 50 cm³</li>
                <li>Bis 45 km/h</li>
                <li>Perfekt für den Schulweg</li>
              </ul>
              <a className="t-btn t-btn--cyan" href="#funnel">Beratung starten</a>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="1">
              <span className="ic"><LottieIcon name="Bike-1" /></span>
              <span className="t-pill">Klasse A1</span>
              <h3>Leichtkrafträder</h3>
              <ul>
                <li>Ab 16 Jahren</li>
                <li>Motorräder bis 125 cm³</li>
                <li>Max. 11 kW (15 PS)</li>
                <li>Für Pkw-Fahrer: B196-Erweiterung ab 25 Jahren mit 5 Jahren Klasse B — ohne Prüfung, gilt nur in Deutschland</li>
              </ul>
              <a className="t-btn t-btn--cyan" href="#funnel">Beratung starten</a>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="2">
              <span className="ic"><LottieIcon name="Morden-Bike" /></span>
              <span className="t-pill">Klasse A2</span>
              <h3>Mittlere Motorräder</h3>
              <ul>
                <li>Ab 18 Jahren</li>
                <li>Motorräder bis 35 kW (48 PS)</li>
                <li>Leistungsgewicht max. 0,2 kW/kg</li>
                <li>Der Klassiker für den Einstieg</li>
              </ul>
              <a className="t-btn t-btn--cyan" href="#funnel">Beratung starten</a>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="3">
              <span className="ic"><LottieIcon name="Sports-Bike" /></span>
              <span className="t-pill">Klasse A</span>
              <h3>Offene Klasse</h3>
              <ul>
                <li>Ab 24 Jahren im Direkteinstieg</li>
                <li>Oder ab 20 mit 2 Jahren Klasse A2</li>
                <li>Aufstieg nur mit praktischer Prüfung — keine Theorie nötig</li>
                <li>Keine Leistungsbegrenzung</li>
              </ul>
              <a className="t-btn t-btn--cyan" href="#funnel">Beratung starten</a>
            </article>
          </div>
        </div>
      </section>

      {/* ================= Ablauf ================= */}
      <section className="t-sec">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">So läuft&rsquo;s ab</span>
            <h2>In vier Schritten aufs Motorrad</h2>
          </div>
          <div className="steps" style={{ maxWidth: 720, marginInline: "auto" }}>
            <div className="step t-reveal">
              <div>
                <h3>Beratung</h3>
                <p>Wir klären gemeinsam, welche Klasse zu dir passt — je nach Alter, Vorbesitz und dem, was du fahren willst. Ehrlich, ohne Verkaufsdruck.</p>
              </div>
            </div>
            <div className="step t-reveal" data-delay="1">
              <div>
                <h3>Anmeldung</h3>
                <p>Du meldest dich bei uns an, wir helfen beim Antrag für die Fahrerlaubnis und du bekommst dein Lernmaterial für die Theorie.</p>
              </div>
            </div>
            <div className="step t-reveal" data-delay="2">
              <div>
                <h3>Theorie</h3>
                <p>
                  Du besuchst den Theorieunterricht inklusive der motorradspezifischen Themen — die Termine
                  findest du im <Link href="/theorieplan">Theorieplan</Link> und unter{" "}
                  <Link href="/#termine">Termine</Link>.
                </p>
              </div>
            </div>
            <div className="step t-reveal" data-delay="3">
              <div>
                <h3>Praxis &amp; Prüfung</h3>
                <p>Fahrstunden auf unseren Honda-Maschinen, Grundfahraufgaben auf dem Platz, Sonderfahrten über Land, Autobahn und bei Nacht — dann geht&rsquo;s zur Prüfung.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Funnel ================= */}
      <section className="t-sec t-sec--soft funnel-sec" id="funnel">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Führerschein-Check</span>
            <h2>Finde in 2 Minuten deine Motorradklasse</h2>
            <p>Beantworte ein paar Fragen und wir melden uns mit einer ehrlichen Einschätzung und einer transparenten Preisauskunft bei dir.</p>
          </div>
          <div className="t-reveal">
            <Funnel config={getFunnelConfig()} telefon={telefon} prefill="motorrad" />
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="t-sec">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Fragen &amp; Antworten</span>
            <h2>Häufige Fragen zum Motorradführerschein</h2>
          </div>
          <Faq
            fragen={[
              {
                f: "Was kostet der Motorradführerschein in Potsdam?",
                a: 'Das hängt von der Klasse ab, von deinem Vorbesitz (etwa A1 oder A2) und vor allem davon, wie viele Fahrstunden du brauchst — und das ist bei jedem anders. Pauschale Zahlen wären deshalb unehrlich. Ruf uns an oder starte den <a href="#funnel">Führerschein-Check</a>: Du bekommst von uns eine transparente Aufstellung, was in deinem Fall auf dich zukommt.',
              },
              {
                f: "Was ist der Unterschied zwischen B196 und Klasse A1?",
                a: "B196 ist keine eigene Führerscheinklasse, sondern eine Erweiterung deines Pkw-Führerscheins: ab 25 Jahren und mit mindestens 5 Jahren Klasse B darfst du nach einer Fahrerschulung bei uns 125er fahren — ganz ohne Prüfung, aber nur in Deutschland. Die Klasse A1 ist ein vollwertiger Führerschein: mit Theorie- und Praxisprüfung, gültig auch im Ausland und mit der Möglichkeit, später auf A2 und A aufzusteigen.",
              },
              {
                f: "Wie lange dauert die Ausbildung?",
                a: 'Das liegt an dir: Wer regelmäßig zur Theorie kommt und zügig Fahrstunden nimmt, kann die Ausbildung in wenigen Wochen schaffen — realistisch sind je nach Terminlage und Übungsbedarf einige Wochen bis wenige Monate. Die Theorietermine laufen bei uns nach festem Plan, du findest sie im <a href="/theorieplan">Theorieplan</a> und unter <a href="/#termine">Termine</a>.',
              },
              {
                f: "Brauche ich eigene Schutzkleidung?",
                a: "Für Fahrstunden und Prüfung brauchst du komplette Schutzkleidung: Helm, Handschuhe, Jacke mit Protektoren, feste Hose und knöchelhohe Stiefel. Vieles davon lohnt sich ohnehin als eigene Anschaffung, weil die Passform stimmen muss — gerade beim Helm. Was wir dir für den Anfang stellen können und was du dir selbst besorgen solltest, klären wir ehrlich im Gespräch: sprich uns einfach an.",
              },
              {
                f: "Wie komme ich von A2 zur offenen Klasse A?",
                a: "Nach 2 Jahren mit der Klasse A2 kannst du ab 20 Jahren in die offene Klasse A aufsteigen. Dafür ist nur eine praktische Aufstiegsprüfung nötig — Theorieunterricht und Theorieprüfung entfallen. Bei uns bereitest du dich darauf auf der brandneuen Honda Hornet vor.",
              },
              {
                f: "Kann ich im Winter mit der Ausbildung anfangen?",
                a: "Ja — der Winter ist sogar ein guter Startzeitpunkt. Du erledigst Anmeldung, Antrag und die komplette Theorie in der kalten Jahreszeit und sitzt im Frühjahr sofort auf dem Motorrad, wenn andere erst mit dem Papierkram anfangen. Bei mildem Wetter sind auch im Winter Fahrstunden möglich — das entscheiden wir gemeinsam nach Wetterlage.",
              },
            ]}
          />
          <p style={{ textAlign: "center", marginTop: "2.4rem" }} className="t-reveal">
            Noch mehr bei Toros: <Link href="/anhaenger-fuehrerschein-potsdam">Anhängerführerschein BE</Link> ·{" "}
            <Link href="/seminare">ASF- &amp; FES-Seminare</Link> · <Link href="/#fahrlehrer">unsere Fahrlehrer</Link>
          </p>
        </div>
      </section>

      <CtaBand
        titel="Bereit für zwei Räder?"
        text="Starte den Führerschein-Check oder ruf uns an — wir sagen dir ehrlich, welche Klasse zu dir passt."
      />
    </>
  );
}
