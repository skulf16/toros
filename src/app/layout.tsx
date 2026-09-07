import type { Metadata } from "next";
import localFont from "next/font/local";
import { getSetting } from "@/lib/db";
import "./globals.css";

const cairo = localFont({
  src: "../fonts/cairo-var.woff2",
  weight: "400 800",
  variable: "--font-cairo",
  display: "swap",
});

const rajdhani = localFont({
  src: [
    { path: "../fonts/rajdhani-500.woff2", weight: "500" },
    { path: "../fonts/rajdhani-600.woff2", weight: "600" },
    { path: "../fonts/rajdhani-700.woff2", weight: "700" },
  ],
  variable: "--font-rajdhani",
  display: "swap",
});

// Inhalte (Termine, Funnel-Konfiguration, Stammdaten) kommen aus der DB und
// sollen ohne Rebuild aktuell sein.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Fahrschule Toros — Führerschein in Potsdam & Nuthetal",
    template: "%s | Fahrschule Toros",
  },
  description:
    "Fahrschule Toros in Nuthetal bei Potsdam: Auto-, Motorrad- und Anhängerführerschein mit modernen Fahrzeugen, Theorie täglich und Ausbildung in 7 Sprachen.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gtmId = getSetting("gtm_id");

  return (
    <html lang="de" className={`no-js ${cairo.variable} ${rajdhani.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.replace('no-js','js');`,
          }}
        />
        {gtmId ? (
          <>
            {/* Google Consent Mode v2: Standard = abgelehnt, bis ein CMP zustimmt */}
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId.replace(/[^A-Z0-9-]/gi, "")}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId.replace(/[^A-Z0-9-]/gi, "")}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        {children}
      </body>
    </html>
  );
}
