import { redirect } from "next/navigation";
import Link from "next/link";
import { istEingeloggt } from "@/lib/session";
import { leadsLogoutAction } from "@/app/admin/actions";
import LeadsNavLinks from "./LeadsNavLinks";

export const metadata = { title: "Leads", robots: { index: false, follow: false } };

export default async function LeadsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await istEingeloggt("leads"))) redirect("/leads/login");

  return (
    <div className="admin-shell">
      <nav className="admin-nav" aria-label="Leads-Navigation">
        <Link href="/" className="logo" title="Zur Website">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.png" alt="Fahrschule Toros" />
        </Link>
        <div className="nav-links">
          <LeadsNavLinks />
        </div>
        <div className="unten">
          <form action={leadsLogoutAction}>
            <button className="a-btn" type="submit">Abmelden</button>
          </form>
        </div>
      </nav>
      <div className="admin-main">{children}</div>
      <nav className="admin-tabbar" aria-label="Leads-Navigation (mobil)">
        <LeadsNavLinks />
      </nav>
    </div>
  );
}
