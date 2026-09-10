import type { Metadata, Viewport } from "next";

/**
 * Bereichs-Layout für /leads (inkl. Login & Passwort-Reset): macht das Panel
 * als PWA installierbar — „Zum Home-Bildschirm“ öffnet es ohne Browser-Leiste.
 */
export const metadata: Metadata = {
  manifest: "/leads-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Toros Leads",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/img/app-icon-180.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#222d35",
};

export default function LeadsBereichLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
