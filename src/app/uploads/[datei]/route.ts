import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Liefert von der Sekretärin hochgeladene Galerie-Bilder aus ./data/uploads
 * aus — der Ordner liegt bewusst neben der SQLite-Datei (beschreibbar,
 * überlebt Deployments), nicht in public/.
 */

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ datei: string }> }
) {
  const { datei } = await params;
  const mime = MIME[path.extname(datei).toLowerCase()];
  if (!/^[a-zA-Z0-9._-]+$/.test(datei) || datei.includes("..") || !mime) {
    return new NextResponse("Nicht gefunden", { status: 404 });
  }
  const voll = path.join(UPLOAD_DIR, datei);
  if (!fs.existsSync(voll)) {
    return new NextResponse("Nicht gefunden", { status: 404 });
  }
  return new NextResponse(new Uint8Array(fs.readFileSync(voll)), {
    headers: {
      "Content-Type": mime,
      // Dateinamen sind einmalig (Zeitstempel) — darf ewig gecacht werden.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
