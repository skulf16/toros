import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

export default function Impressum() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/content/impressum.html"),
    "utf8"
  );
  return (
    <article className="t-sec page-plain">
      <div className="wrap inhalt">
        <h1>Impressum</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
