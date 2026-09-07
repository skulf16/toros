import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";

export const metadata: Metadata = { title: "Datenschutz", robots: { index: false } };

export default function Datenschutz() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/content/datenschutz.html"),
    "utf8"
  );
  return (
    <article className="t-sec page-plain">
      <div className="wrap inhalt">
        <h1>Datenschutzerklärung</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
