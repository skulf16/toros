"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Beobachtet alle .t-reveal-Elemente und blendet sie beim Scrollen ein.
 * Einmal pro Seite einbinden (Site-Layout).
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const elemente = document.querySelectorAll<HTMLElement>(".t-reveal:not(.is-inview)");
    if (!("IntersectionObserver" in window)) {
      elemente.forEach((el) => el.classList.add("is-inview"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-inview");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    elemente.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
