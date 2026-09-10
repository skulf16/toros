import type { Metadata, Viewport } from "next";

/**
 * Bereichs-Layout für /admin (inkl. Login & Passwort-Reset): macht das Panel
 * als PWA installierbar — „Zum Home-Bildschirm“ öffnet es ohne Browser-Leiste.
 */
export const metadata: Metadata = {
  manifest: "/admin-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Toros Admin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/img/app-icon-180.png",
  },
  // Ältere iOS-Versionen kennen nur das apple-Präfix; Next 16 schreibt sonst
  // nur das neutrale mobile-web-app-capable.
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#222d35",
};

export default function AdminBereichLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
