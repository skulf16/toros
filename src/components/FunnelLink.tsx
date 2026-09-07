"use client";

/**
 * Button, der zum Führerschein-Check im Hero scrollt und dort Kategorie
 * (und optional Klasse) vorauswählt — genutzt an den Führerschein-Karten.
 */
export default function FunnelLink({
  kategorie,
  klasse,
  className,
  children,
}: {
  kategorie: string;
  klasse?: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("toros-funnel-prefill", { detail: { kategorie, klasse } })
        );
        document.getElementById("funnel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {children}
    </button>
  );
}
