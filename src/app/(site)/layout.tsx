import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SchemaOrg from "@/components/SchemaOrg";
import { getAktionsBanner, getSetting } from "@/lib/db";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <Header anmeldungUrl={getSetting("anmeldung_url")} banner={getAktionsBanner()} />
      <main id="inhalt">{children}</main>
      <Footer />
      <Reveal />
      <SchemaOrg />
    </>
  );
}
