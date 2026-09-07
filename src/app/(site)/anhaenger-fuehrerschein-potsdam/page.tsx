import type { Metadata } from "next";
import Link from "next/link";
import Funnel from "@/components/Funnel";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import { Icon } from "@/components/icons";
import { getFunnelConfig, getSetting } from "@/lib/db";

export const metadata: Metadata = {
  title: "Anhängerführerschein Potsdam — B96 & BE",
  description:
    "Anhängerführerschein B96 oder BE in Potsdam & Nuthetal: für Wohnwagen, Pferde- oder Bootsanhänger. Kompakte Ausbildung, moderne Zugfahrzeuge. Jetzt informieren!",
};

export default function AnhaengerLanding() {
  const telefon = getSetting("telefon");
  const telefonRaw = telefon.replace(/[^\d+]/g, "");

  return (
    <>
      {/* ================= Hero ================= */}
      <section className="hero-sub" style={{ ["--hero-img" as string]: "url('/img/fuhrpark-gle.jpg')" }}>
        <div className="wrap">
          <span className="t-pill">Anhänger &amp; Erweiterung</span>
          <h1>Anhängerführerschein in Potsdam &amp; Nuthetal</h1>
          <p className="sub">
            Wohnwagen, Pferdeanhänger oder Bootstrailer — mit B96 oder BE ziehst du, was du willst. Wir sagen
            dir ehrlich, welche Klasse du wirklich brauchst, und bringen dich mit unserem modernen
            Mercedes-Gespann sicher ans Ziel.
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
            <span className="t-pill">B96 &amp; BE</span>
            <h2>Mehr ziehen dürfen — schnell und unkompliziert</h2>
            <p>
              Der Anhänger Führerschein ist die wohl schnellste Führerschein-Erweiterung überhaupt: Für B96
              gibt es nicht einmal eine Prüfung, für BE nur eine praktische. Wenn du Klasse B schon hast,
              trennt dich also nur wenig von deinem Wohnwagen-Urlaub, dem Pferdeanhänger oder dem Bootstrailer
              für die Havel.
            </p>
            <p>
              Rund um Potsdam und Nuthetal gibt es genug Gründe für einen Hänger: Camperinnen und Camper
              starten Richtung Ostsee, die Reiterhöfe in Bergholz-Rehbrücke, Michendorf und Umgebung brauchen
              Pferdetransporte, an der Havel wollen Boote ins Wasser — und im Handwerk gehört der Anhänger mit
              Maschinen oder Material ohnehin zum Alltag.
            </p>
            <p>
              Geübt wird bei uns mit einem modernen Mercedes als Zugfahrzeug — den kennst du vielleicht schon
              aus unserem <Link href="/#fuhrpark">Fuhrpark</Link>. Und wenn dich neben vier Rädern auch zwei
              reizen: Alles zum{" "}
              <Link href="/motorradfuehrerschein-potsdam">Motorradführerschein in Potsdam</Link> findest du auf
              unserer eigenen Seite.
            </p>
          </div>
          <div className="t-card t-reveal" data-delay="1">
            <h3>Anhängerführerschein bei Toros</h3>
            <ul className="check-list">
              <li>B96 und BE aus einer Hand — inklusive ehrlicher Empfehlung, was du brauchst</li>
              <li>Keine Theorieprüfung: B96 ganz ohne Prüfung, BE nur mit praktischer Prüfung</li>
              <li>B96-Schulung kompakt — Theorie und Praxis an einem Tag möglich</li>
              <li>Modernes Gespann: Mercedes als Zugfahrzeug, gepflegter Anhänger</li>
              <li>Erfahrene <Link href="/#fahrlehrer">Fahrlehrer</Link>, die Rangieren und Rückwärtsfahren geduldig erklären</li>
              <li>Transparente Preisauskunft am Telefon oder über den Funnel — ohne Kleingedrucktes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= Klassen ================= */}
      <section className="t-sec t-sec--cyan">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Deine Optionen</span>
            <h2>B96 oder BE — was passt zu dir?</h2>
          </div>
          <div className="t-grid t-grid--3">
            <article className="t-card klasse-card t-reveal">
              <span className="ic"><Icon name="anhaenger" /></span>
              <span className="t-pill">B96</span>
              <h3>Die Erweiterung ohne Prüfung</h3>
              <ul>
                <li>Nur eine Schulung — keine Theorie- und keine praktische Prüfung</li>
                <li>Theorie und Praxis an einem Tag möglich</li>
                <li>Zugkombination über 3,5 t bis 4,25 t zulässige Gesamtmasse</li>
                <li>Ideal für Wohnwagen und Camping</li>
              </ul>
              <a className="t-btn" href="#funnel">Beratung starten</a>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="1">
              <span className="ic"><Icon name="anhaenger" /></span>
              <span className="t-pill">Klasse BE</span>
              <h3>Die eigene Anhängerklasse</h3>
              <ul>
                <li>Praktische Prüfung — aber keine Theorieprüfung</li>
                <li>Anhänger über 750 kg bis 3,5 t zulässige Gesamtmasse</li>
                <li>Für Pferdeanhänger, Boots- und Autotrailer</li>
                <li>Auch für Baumaschinen und schwere Arbeitsanhänger</li>
              </ul>
              <a className="t-btn" href="#funnel">Beratung starten</a>
            </article>
            <article className="t-card klasse-card t-reveal" data-delay="2">
              <span className="ic"><Icon name="auto" /></span>
              <span className="t-pill">Klasse B</span>
              <h3>Was schon ohne Erweiterung geht</h3>
              <ul>
                <li>Anhänger bis 750 kg zulässige Gesamtmasse — immer erlaubt</li>
                <li>Schwerere Anhänger, wenn die Zugkombination max. 3,5 t wiegt</li>
                <li>Reicht für kleine Transport- und Gartenanhänger oft aus</li>
              </ul>
              <Link className="t-btn" href="/#pkw-fuehrerschein">Mehr zu Klasse B</Link>
            </article>
          </div>
        </div>
      </section>

      {/* ================= Ablauf ================= */}
      <section className="t-sec">
        <div className="wrap info-split">
          <div className="t-reveal">
            <span className="t-pill">Ablauf</span>
            <h2>So kommst du an deinen Anhängerführerschein</h2>
            <p>
              Vom ersten Anruf bis zur Fahrt mit Hänger vergehen bei uns keine Monate. Weil bei B96 die Prüfung
              komplett entfällt und BE ohne Theorieprüfung auskommt, ist die Erweiterung deutlich schneller
              erledigt als ein kompletter Führerschein.
            </p>
            <p>
              Du willst dein Theoriewissen trotzdem auffrischen? Unsere aktuellen Unterrichtstermine findest du
              im <Link href="/theorieplan">Theorieplan</Link> — du bist jederzeit willkommen.
            </p>
          </div>
          <div className="steps t-reveal" data-delay="1">
            <div className="step">
              <div>
                <h3>Beratung</h3>
                <p>Du sagst uns, was du ziehen willst — Wohnwagen, Pferdeanhänger, Boot oder Baumaschine. Wir rechnen kurz nach und empfehlen dir B96 oder BE.</p>
              </div>
            </div>
            <div className="step">
              <div>
                <h3>Anmeldung</h3>
                <p>Für BE stellst du den Antrag bei der Führerscheinstelle, wir helfen bei den Unterlagen. Für B96 geht es ohne Antrag direkt in die Planung.</p>
              </div>
            </div>
            <div className="step">
              <div>
                <h3>Schulung &amp; Fahrstunden</h3>
                <p>B96: kompakte Tagesschulung mit Theorieteil und Fahrpraxis. BE: Fahrstunden mit dem Gespann — Rangieren, An- und Abkuppeln, Fahren im Verkehr.</p>
              </div>
            </div>
            <div className="step">
              <div>
                <h3>Prüfung bzw. Bescheinigung</h3>
                <p>Bei B96 bekommst du nach der Schulung deine Bescheinigung für die Führerscheinstelle. Bei BE legst du die praktische Prüfung ab — gut vorbereitet mit deinem Fahrlehrer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Funnel ================= */}
      <section className="t-sec t-sec--soft funnel-sec" id="funnel">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Unverbindlich anfragen</span>
            <h2>Finde in 2 Minuten deine Anhängerklasse</h2>
            <p>Beantworte ein paar kurze Fragen — wir melden uns mit einer ehrlichen Empfehlung und einer transparenten Preisauskunft.</p>
          </div>
          <div className="t-reveal">
            <Funnel config={getFunnelConfig()} telefon={telefon} prefill="anhaenger" />
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="t-sec">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">FAQ</span>
            <h2>Häufige Fragen zum Anhängerführerschein</h2>
          </div>
          <Faq
            fragen={[
              {
                f: "B96 oder BE — was brauche ich für meinen Wohnwagen?",
                a: "Rechne einfach die zulässigen Gesamtmassen zusammen. Beispiel: Dein SUV darf 2.500 kg wiegen, dein Wohnwagen 1.500 kg — zusammen 4.000 kg. Das ist mehr als 3.500 kg, also reicht Klasse B nicht mehr. Weil die Kombination aber unter 4.250 kg bleibt, genügt B96. Erst wenn dein Anhänger über 750 kg liegt und die Kombination schwerer als 4.250 kg ist, brauchst du BE. Schick uns deine Fahrzeugdaten — wir rechnen kostenlos für dich nach.",
              },
              {
                f: "Wie schnell geht die Klasse BE?",
                a: "BE ist eine der kompaktesten Ausbildungen überhaupt: Es gibt keine Theorieprüfung, du machst nur die praktische Ausbildung mit deinem Fahrlehrer und danach die praktische Prüfung. Wie viele Fahrstunden du brauchst, hängt von deiner Erfahrung ab — viele schaffen es innerhalb weniger Wochen. Sobald der Antrag bei der Führerscheinstelle durch ist, legen wir los.",
              },
              {
                f: "Was kostet der Anhängerführerschein?",
                a: 'Das hängt davon ab, ob du B96 oder BE machst und wie viele Fahrstunden du bei BE brauchst. Pauschale Zahlen im Internet helfen dir da wenig. Ruf uns an oder nutze den <a href="#funnel">Funnel oben</a> — du bekommst von uns eine ehrliche, transparente Preisauskunft, bevor du dich anmeldest.',
              },
              {
                f: "Brauche ich Theoriestunden?",
                a: 'Für BE ist weder Theorieunterricht noch eine Theorieprüfung vorgeschrieben — du lernst alles Wichtige direkt im Gespann. Bei B96 gehört ein kurzer Theorieteil zur Tagesschulung dazu. Wenn du dein Wissen freiwillig auffrischen willst, schau in unseren <a href="/theorieplan">Theorieplan</a> und setz dich einfach dazu.',
              },
              {
                f: "Darf ich mit BE ein Wohnmobil fahren?",
                a: "Nein — BE betrifft ausschließlich Anhänger. Ein Wohnmobil ist ein eigenes Kraftfahrzeug: Bis 3,5 t zulässige Gesamtmasse reicht deine Klasse B, darüber brauchst du die Klasse C1. Für Wohnwagen-Gespanne ist BE dagegen genau richtig.",
              },
              {
                f: "Wo ist die Prüfung und wie läuft sie ab?",
                a: 'Die praktische BE-Prüfung legst du bei der amtlichen Prüfstelle in der Region Potsdam ab, sie dauert rund 45 Minuten. Geprüft werden An- und Abkuppeln, Rückwärtsfahren und Rangieren mit dem Anhänger sowie eine Fahrt im echten Verkehr. Genau das üben wir vorher so lange, bis du dich sicher fühlst — mit demselben Gespann, mit dem du auch in die Prüfung gehst. Übrigens: Wenn es mal um Punkte oder Auflagen geht, helfen wir dir auch mit unseren <a href="/seminare">Seminaren</a> weiter.',
              },
            ]}
          />
        </div>
      </section>

      <CtaBand
        titel="Hänger dran — und los"
        text="Sag uns, was du ziehen willst. Wir sagen dir ehrlich, welche Klasse du brauchst, und legen direkt los."
      />
    </>
  );
}
