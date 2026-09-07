export type FaqEintrag = { f: string; a: string };

/**
 * FAQ-Akkordeon inkl. FAQPage-Schema. Antworten dürfen einfaches HTML
 * enthalten (Links etc.) — Inhalte stammen ausschließlich aus dem Code.
 */
export default function Faq({ fragen }: { fragen: FaqEintrag[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fragen.map((qa) => ({
      "@type": "Question",
      name: qa.f,
      acceptedAnswer: { "@type": "Answer", text: qa.a.replace(/<[^>]+>/g, "") },
    })),
  };

  return (
    <div className="faq">
      {fragen.map((qa, i) => (
        <details key={qa.f} open={i === 0} className="t-reveal">
          <summary>{qa.f}</summary>
          <div className="antwort" dangerouslySetInnerHTML={{ __html: qa.a }} />
        </details>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  );
}
