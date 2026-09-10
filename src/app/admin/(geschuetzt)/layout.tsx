import { redirect } from "next/navigation";
import Link from "next/link";
import { istEingeloggt } from "@/lib/session";
import { logoutAction } from "../actions";
import AdminNavLinks from "./AdminNavLinks";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await istEingeloggt())) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <nav className="admin-nav" aria-label="Admin-Navigation">
        <Link href="/" className="logo" title="Zur Website">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.png" alt="Fahrschule Toros" />
        </Link>
        <div className="nav-links">
          <AdminNavLinks />
        </div>
        <div className="unten">
          <form action={logoutAction}>
            <button className="a-btn" type="submit">Abmelden</button>
          </form>
        </div>
      </nav>
      <div className="admin-main">{children}</div>
      <nav className="admin-tabbar" aria-label="Admin-Navigation (mobil)">
        <AdminNavLinks />
      </nav>
    </div>
  );
}
