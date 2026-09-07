import type { Metadata } from "next";
import Link from "next/link";
import Funnel from "@/components/Funnel";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import { Icon } from "@/components/icons";
import { getFunnelConfig, getSetting } from "@/lib/db";

export const metadata: Metadata = {
  title: "Punkte abbauen in Potsdam: Fahreignungsseminar (FES) & Aufbauseminar (ASF)",
  description:
    "Punkte in Flensburg abbauen mit dem Fahreignungsseminar (FES), Aufbauseminar für Fahranfänger (ASF) und MPU-Vorbereitung in Potsdam & Nuthetal. Feste Termine, transparente Kosten — Führerschein behalten.",
};

export default function SeminareLanding() {
  const telefon = getSetting("telefon");
  const telefonRaw = telefon.replace(/[^\d+]/g, "");

  return (
    <>
      {/* ================= Hero ================= */}
      <section className="hero-sub" style={{ ["--hero-img" as string]: "url('/img/bg-kontakt.jpg')" }}>
        <div className="wrap">
          <span className="t-pill">Seminare</span>
          <h1>Punkte abbauen &amp; Führerschein behalten</h1>
          <p className="sub">
            Einmal geblitzt, einmal nicht aufgepasst — Punkte in Flensburg können jedem passieren. Mit dem
            Fahreignungsseminar baust du aktiv einen Punkt ab, mit dem Aufbauseminar erfüllst du die Auflage
            aus der Probezeit. Feste Termine, transparente Kosten, erfahrene Seminarleitung.
          </p>
          <div className="actions">
            <a className="t-btn" href="#funnel">Platz anfragen</a>
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
            <span className="t-pill">Punkteabbau &amp; Aufbauseminar</span>
            <h2>Punkte in Flensburg abbauen — so funktioniert&rsquo;s in Potsdam</h2>
            <p>
              Wer 1 bis 5 Punkte im Fahreignungsregister hat, kann mit einem freiwilligen{" "}
              Fahreignungsseminar (FES) einen Punkt abbauen — und damit den Abstand zum Führerscheinentzug
              vergrößern, der ab 8 Punkten droht. Fahranfängern, die in der Probezeit auffällig geworden sind,
              ordnet die Fahrerlaubnisbehörde ein Aufbauseminar (ASF) an. Beides bekommst du bei uns: kompakt,
              zu festen Terminen und ohne lange Wartezeit.
            </p>
            <p>
              Unsere Fahrschule liegt in Nuthetal, direkt an der Stadtgrenze zu Potsdam — gut erreichbar auch
              aus Michendorf, Stahnsdorf, Teltow und dem Umland. Die Seminare finden in kleinen Gruppen statt,
              geleitet von <Link href="/#fahrlehrer">unserem erfahrenen Team</Link> mit der nötigen
              Seminarerlaubnis. Die Kosten nennen wir dir vorab klar und transparent — am Telefon oder über die
              Anfrage unten.
            </p>
            <p>
              Du willst zusätzlich mobil bleiben oder aufsteigen? Wir bilden in allen Klassen aus — vom{" "}
              <Link href="/">Autoführerschein</Link> über den{" "}
              <Link href="/motorradfuehrerschein-potsdam">Motorradführerschein</Link> bis zum{" "}
              <Link href="/anhaenger-fuehrerschein-potsdam">Anhängerführerschein</Link>.
            </p>
          </div>
          <div className="t-card t-reveal" data-delay="1">
            <h3>Gut zu wissen: Punkte &amp; Fristen</h3>
            <ul className="check-list">
              <li><strong>1 Punkt Abbau</strong> pro Fahreignungsseminar — möglich bei 1 bis 5 Punkten, einmal alle 5 Jahre.</li>
              <li><strong>Ab 8 Punkten</strong> wird die Fahrerlaubnis entzogen — rechtzeitig handeln lohnt sich.</li>
              <li><strong>Punkte verfallen</strong> sonst erst nach 2,5, 5 oder 10 Jahren — je nach Verstoß.</li>
              <li><strong>ASF-Frist beachten:</strong> Die Behörde setzt eine Frist (meist 8 Wochen) — wir vergeben Plätze entsprechend schnell.</li>
              <li><strong>Teilnahmebescheinigung</strong> gibt&rsquo;s direkt im Anschluss — beim FES binnen 2 Wochen bei der Behörde einreichen.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= Seminar-Karten ================= */}
      <section className="t-sec t-sec--dark">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Unsere Seminare</span>
            <h2>Punkteabbau, ASF &amp; MPU-Vorbereitung — was ist was?</h2>
            <p>Drei Angebote, ein Ziel: Du behältst deinen Führerschein und bleibst mobil.</p>
          </div>
          <div className="t-grid t-grid--3">
            <article className="t-card klasse-card seminar-card t-reveal" id="fes">
              <span className="ic"><Icon name="scale" /></span>
              <span className="t-pill">FES</span>
              <h3>Fahreignungsseminar — Punkteabbau</h3>
              <hr />
              <ul>
                <li>Freiwillig: baut 1 Punkt in Flensburg ab — bei 1 bis 5 Punkten, einmal alle 5 Jahre</li>
                <li>Verkehrspädagogisches Modul bei uns: 2 Sitzungen à 90 Minuten</li>
                <li>Verkehrspsychologisches Modul: 2 Einzelsitzungen à 75 Minuten bei einer Verkehrspsychologin / einem Verkehrspsychologen</li>
                <li>Lohnt sich, bevor das Punktekonto weiter wächst — ab 6 Punkten ist kein Abbau mehr möglich</li>
              </ul>
              <a className="t-btn" href="#funnel">Punkt abbauen</a>
            </article>
            <article className="t-card klasse-card seminar-card t-reveal" data-delay="1" id="asf">
              <span className="ic"><Icon name="shield" /></span>
              <span className="t-pill">ASF</span>
              <h3>Aufbauseminar für Fahranfänger</h3>
              <hr />
              <ul>
                <li>Wird von der Fahrerlaubnisbehörde nach einem A-Verstoß oder zwei B-Verstößen in der Probezeit angeordnet</li>
                <li>4 Gruppensitzungen à 135 Minuten plus eine Beobachtungsfahrt</li>
                <li>Frist im Bescheid beachten (meist 8 Wochen) — sonst droht der Entzug der Fahrerlaubnis</li>
                <li>Teilnahmebescheinigung bekommst du direkt von uns</li>
              </ul>
              <a className="t-btn" href="#funnel">Platz sichern</a>
            </article>
            <article className="t-card klasse-card seminar-card t-reveal" data-delay="2" id="mpu">
              <span className="ic"><Icon name="brain" /></span>
              <span className="t-pill">MPU</span>
              <h3>MPU-Vorbereitung</h3>
              <hr />
              <ul>
                <li>Strukturierte Vorbereitung auf die medizinisch-psychologische Untersuchung</li>
                <li>Persönliche Einzelgespräche statt Schema F</li>
                <li>Ehrliche Einschätzung, wann du wirklich bereit bist</li>
                <li>Auf Wunsch anschließend Fahrstunden zum Wiedereinstieg</li>
              </ul>
              <a className="t-btn" href="#funnel">Vorbereitung anfragen</a>
            </article>
          </div>
        </div>
      </section>

      {/* ================= Ablauf ================= */}
      <section className="t-sec">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">So läuft&rsquo;s bei uns</span>
            <h2>In vier Schritten zum Ziel</h2>
          </div>
          <div className="steps" style={{ maxWidth: 820, marginInline: "auto" }}>
            <div className="step t-reveal">
              <div>
                <h3>Kostenlose Erstberatung</h3>
                <p>Du meldest dich über das Formular oder rufst kurz an. Wir klären deinen Punktestand bzw. deinen Bescheid und sagen dir klar, welches Seminar das richtige ist — inklusive transparenter Preisauskunft.</p>
              </div>
            </div>
            <div className="step t-reveal" data-delay="1">
              <div>
                <h3>Fester Termin — schnell vergeben</h3>
                <p>Gerade beim ASF läuft eine behördliche Frist, und auch beim Punkteabbau zählt der Zeitpunkt. Deshalb bekommst du bei uns zügig einen festen Platz, auf den du dich verlassen kannst.</p>
              </div>
            </div>
            <div className="step t-reveal" data-delay="2">
              <div>
                <h3>Seminar mit erfahrener Leitung</h3>
                <p>Kleine Gruppen, praxisnahe Inhalte, entspannte Atmosphäre. Wer bei uns vorne sitzt, siehst du auf der <Link href="/#fahrlehrer">Team-Seite der Fahrschule</Link>.</p>
              </div>
            </div>
            <div className="step t-reveal" data-delay="3">
              <div>
                <h3>Bescheinigung &amp; Punkt weg</h3>
                <p>Du bekommst deine Teilnahmebescheinigung direkt im Anschluss. Beim FES reichst du sie binnen 2 Wochen bei der Behörde ein — dann wird der Punkt gelöscht. Mehr über uns findest du auf der <Link href="/">Startseite</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Funnel ================= */}
      <section className="t-sec t-sec--soft funnel-sec" id="funnel">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">Anfrage</span>
            <h2>Sag uns kurz, worum es geht</h2>
            <p>Unverbindlich und kostenlos — wir melden uns schnell mit Termin und Preis zurück.</p>
          </div>
          <div className="t-reveal">
            <Funnel config={getFunnelConfig()} telefon={telefon} prefill="seminar" label={getFunnelConfig().seminarLabel} />
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="t-sec">
        <div className="wrap">
          <div className="t-sec-head">
            <span className="t-pill">FAQ</span>
            <h2>Häufige Fragen zu Punkteabbau, ASF &amp; MPU</h2>
          </div>
          <Faq
            fragen={[
              {
                f: "Wie kann ich Punkte in Flensburg abbauen?",
                a: "Mit einem freiwilligen Fahreignungsseminar (FES) baust du genau 1 Punkt ab. Voraussetzung: Du hast zum Zeitpunkt der Teilnahme 1 bis 5 Punkte im Fahreignungsregister und hast in den letzten 5 Jahren keinen Punkt über ein FES abgebaut. Ohne Seminar verfallen Punkte erst nach 2,5 Jahren (1 Punkt), 5 Jahren (2 Punkte) oder 10 Jahren (3 Punkte) — aktiver Abbau ist also oft der schnellere Weg.",
              },
              {
                f: "Wie läuft das Fahreignungsseminar ab?",
                a: "Das FES besteht aus zwei Modulen: dem verkehrspädagogischen Teil bei uns in der Fahrschule (2 Sitzungen à 90 Minuten) und dem verkehrspsychologischen Teil (2 Einzelsitzungen à 75 Minuten bei einer Verkehrspsychologin bzw. einem Verkehrspsychologen). Nach Abschluss beider Module bekommst du die Bescheinigung, die du innerhalb von 2 Wochen bei der Fahrerlaubnisbehörde einreichst — dann wird der Punkt gelöscht.",
              },
              {
                f: "Lohnt sich der Punkteabbau für mich?",
                a: "Je früher, desto eher: Ab 6 Punkten ist kein Abbau mehr möglich, und ab 8 Punkten wird die Fahrerlaubnis entzogen. Wer bei 4 oder 5 Punkten steht, schafft sich mit dem FES wieder Luft — gerade wenn du beruflich aufs Auto angewiesen bist. Ruf uns an, wir schauen gemeinsam auf deine Situation.",
              },
              {
                f: "Muss ich am Aufbauseminar (ASF) teilnehmen?",
                a: "Wenn die Fahrerlaubnisbehörde das Aufbauseminar angeordnet hat: ja. Die Anordnung kommt in der Regel nach einem A-Verstoß (z. B. Rotlicht, deutlich zu schnell) oder zwei B-Verstößen in der Probezeit. Wichtig ist die Frist im Bescheid — meist 8 Wochen. Nimmst du nicht rechtzeitig teil, wird dir die Fahrerlaubnis entzogen. Melde dich also früh, dann findest du bei uns sicher einen Platz.",
              },
              {
                f: "Was passiert im ASF?",
                a: 'Das ASF besteht aus 4 Gruppensitzungen à 135 Minuten und einer Beobachtungsfahrt im Fahrschulauto. Es gibt keinen Test und keine Prüfung — es geht um den Austausch über konkrete Verkehrssituationen und darum, was du künftig anders machst. Am Ende bekommst du deine Teilnahmebescheinigung für die Behörde. Nicht zu verwechseln mit dem normalen Theorieunterricht — <a href="/theorieplan">dessen Plan findest du hier</a>.',
              },
              {
                f: "Was kosten die Seminare?",
                a: 'Die Kosten hängen vom Seminar und der Gruppengröße ab — wir nennen sie dir vorab klar und verbindlich, ohne versteckte Posten. Frag einfach über das <a href="#funnel">Formular</a> an oder ruf uns an; du bekommst sofort eine ehrliche Auskunft.',
              },
              {
                f: "Wie läuft die MPU-Vorbereitung ab?",
                a: "In persönlichen Einzelgesprächen bereiten wir dich strukturiert auf die medizinisch-psychologische Untersuchung vor. Wir sagen dir auch offen, wenn du aus unserer Sicht noch nicht so weit bist — das Ziel ist, dass du gut vorbereitet und gefestigt in die Begutachtung gehst und danach wieder sicher mobil bist.",
              },
              {
                f: "Wie schnell bekomme ich einen Termin?",
                a: 'In der Regel sehr zügig — gerade weil beim ASF behördliche Fristen laufen, halten wir die Wartezeiten kurz. Frag einfach über das <a href="#funnel">Formular oben</a> an oder ruf uns direkt an; dann nennen wir dir die nächsten freien Plätze.',
              },
            ]}
          />
        </div>
      </section>

      <CtaBand
        titel="Punkte abbauen? Sichere dir deinen Platz"
        text="Kostenlose Erstberatung, feste Termine, transparente Preise — melde dich einfach kurz."
      />
    </>
  );
}
