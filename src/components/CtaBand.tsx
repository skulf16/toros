import { getSetting } from "@/lib/db";
import AnmeldungButton from "./AnmeldungButton";
import { Icon } from "./icons";

export default function CtaBand({
  titel = "Bereit? Dann starten wir.",
  text = "",
}: {
  titel?: string;
  text?: string;
}) {
  const telefon = getSetting("telefon");
  return (
    <section className="t-sec cta-band">
      <div className="wrap t-reveal">
        <h2>{titel}</h2>
        {text ? <p>{text}</p> : null}
        <div className="actions">
          <AnmeldungButton className="t-btn t-btn--dark" url={getSetting("anmeldung_url")}>
            Zur Online-Anmeldung
          </AnmeldungButton>
          <a className="t-btn" href={"tel:" + telefon.replace(/[^\d+]/g, "")}>
            <Icon name="phone" /> {telefon}
          </a>
        </div>
      </div>
    </section>
  );
}
