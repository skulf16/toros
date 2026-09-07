"use client";

import { useEffect, useRef } from "react";

/**
 * Animiertes Lottie-Icon (Dateien aus /public/lottie, übernommen von der
 * alten Live-Site). Lädt lottie-web erst, wenn das Icon in den Viewport
 * kommt, und respektiert prefers-reduced-motion.
 */
export default function LottieIcon({ name, label }: { name: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let anim: { destroy: () => void } | undefined;
    let abgebrochen = false;
    let gestartet = false;

    const lade = () => {
      if (gestartet) return;
      gestartet = true;
      observer.disconnect();
      import("lottie-web/build/player/lottie_light")
        .then((mod) => {
          // CJS/ESM-Interop: je nach Bundler liegt der Player auf default oder dem Modul selbst.
          const lottie = (mod.default ?? mod) as typeof mod.default;
          if (abgebrochen || typeof lottie.loadAnimation !== "function") return;
          const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          anim = lottie.loadAnimation({
            container: el,
            renderer: "svg",
            loop: !ruhig,
            autoplay: !ruhig,
            path: `/lottie/${name}.json`,
          });
        })
        .catch((err) => console.error("[LottieIcon] Laden fehlgeschlagen:", err));
    };

    const observer = new IntersectionObserver(
      (eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) lade();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);

    return () => {
      abgebrochen = true;
      observer.disconnect();
      anim?.destroy();
    };
  }, [name]);

  return (
    <div
      ref={ref}
      className="lottie-icon"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
