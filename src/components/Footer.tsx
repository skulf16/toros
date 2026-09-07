import Link from "next/link";
import { getSetting } from "@/lib/db";
import { Icon } from "./icons";
import MobileCta from "./MobileCta";

function telHref(nr: string) {
  return "tel:" + nr.replace(/[^\d+]/g, "");
}

export default function Footer() {
  const telefon = getSetting("telefon");
  const email = getSetting("email");

  return (
    <>
      <footer className="site-footer">
        <div className="wrap inner">
          <div className="flogo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.png" alt="Fahrschule Toros" loading="lazy" width={200} height={74} />
          </div>
          <div>
            <div className="item">
              <span className="ic"><Icon name="pin" /></span>
              <span>
                {getSetting("adresse_1")}<br />
                {getSetting("adresse_2")}<br />
                {getSetting("adresse_ort")}
              </span>
            </div>
            <div className="item">
              <span className="ic"><Icon name="clock" /></span>
              <span>
                {getSetting("zeiten_1")}<br />
                {getSetting("zeiten_2")}
              </span>
            </div>
          </div>
          <div>
            <div className="item">
              <span className="ic"><Icon name="phone" /></span>
              <a href={telHref(telefon)}>{telefon}</a>
            </div>
            <div className="item">
              <span className="ic"><Icon name="mail" /></span>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </div>
        </div>
        <div className="footer-legal">
          <div className="wrap inner">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </footer>

      <MobileCta telefon={telefon} />
    </>
  );
}
