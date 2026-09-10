import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIES, tokenErneuern, cookieOptionen, type Bereich } from "@/lib/session";

/**
 * Rollierende Session-Verlängerung für die beiden Panels: Bei jedem Aufruf
 * mit gültigem (und mindestens eine Stunde altem) Cookie wird die volle
 * Laufzeit neu gesetzt — wer das Panel regelmäßig nutzt, bleibt eingeloggt.
 */
export function proxy(request: NextRequest) {
  const bereich: Bereich = request.nextUrl.pathname.startsWith("/leads") ? "leads" : "admin";
  const name = SESSION_COOKIES[bereich];
  const neu = tokenErneuern(request.cookies.get(name)?.value, bereich);
  if (!neu) return NextResponse.next();

  const response = NextResponse.next();
  response.cookies.set(name, neu.token, cookieOptionen(neu.dauerStunden));
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/leads/:path*"],
};
