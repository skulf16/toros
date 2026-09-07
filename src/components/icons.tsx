/**
 * Inline-SVG-Icons — gleiche Linien-Optik wie der bisherige Auftritt.
 */

const PFADE: Record<string, string> = {
  auto: '<path d="M4 16v-3l2-5.5A1.5 1.5 0 0 1 7.4 6.5h9.2A1.5 1.5 0 0 1 18 7.5L20 13v3"/><path d="M4 13h16"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/><path d="M4 16h1.7M9.3 16.5h5.4M18.3 16h1.7"/>',
  schalt: '<circle cx="6" cy="5" r="1.6"/><circle cx="12" cy="5" r="1.6"/><circle cx="18" cy="5" r="1.6"/><circle cx="6" cy="19" r="1.6"/><circle cx="12" cy="19" r="1.6"/><path d="M6 6.6v10.8M12 6.6v10.8M18 6.6V12H6"/>',
  automatik: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 16l2.4-8h1.2L15 16"/><path d="M10 13.4h4"/>',
  anhaenger: '<rect x="2" y="8" width="12" height="8" rx="1.5"/><path d="M14 12h5l3 4"/><circle cx="6" cy="18.5" r="1.8"/><circle cx="19" cy="18.5" r="1.8"/><path d="M2 12h12"/>',
  moto: '<circle cx="5.5" cy="16.5" r="3.2"/><circle cx="18.5" cy="16.5" r="3.2"/><path d="M5.5 16.5 10 9h4.5l1.2 2.5"/><path d="M14.5 9l-1-2.5h2.6"/><path d="M10 9H6.5"/><path d="m15.7 11.5 2.8 5"/>',
  roller: '<circle cx="5.5" cy="17" r="2.6"/><circle cx="18.5" cy="17" r="2.6"/><path d="M8.1 17h6.4l2-6h-4"/><path d="M12.5 11 11 7h-3"/><path d="M16.5 11h2.3"/>',
  bf17: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20c.8-3.2 3-4.8 5.5-4.8s4.7 1.6 5.5 4.8"/><circle cx="17" cy="9" r="2.4"/><path d="M13.7 20c.5-2.4 1.8-3.7 3.3-3.7 1.6 0 2.9 1.3 3.4 3.7"/>',
  shield: '<path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4z"/><path d="m8.8 12 2.2 2.2 4.4-4.4"/>',
  scale: '<path d="M12 3v18"/><path d="M5 7h14"/><path d="M3 13a3.5 3.5 0 0 0 7 0L6.5 7zM14 13a3.5 3.5 0 0 0 7 0L17.5 7z"/><path d="M8 21h8"/>',
  brain: '<path d="M9 5a3 3 0 0 0-3 3 3 3 0 0 0-2 3 3 3 0 0 0 2 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V8a3 3 0 0 0-3-3z"/><path d="M15 5a3 3 0 0 1 3 3 3 3 0 0 1 2 3 3 3 0 0 1-2 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72a2 2 0 0 1 1.72 2.02Z"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
  flash: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v4"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>',
  route: '<circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M8.2 19H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8"/>',
  sprache: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14.5 14.5 0 0 1 0 18 14.5 14.5 0 0 1 0-18z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  pfeil: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
};

export const ICON_NAMEN = Object.keys(PFADE);

export function Icon({ name, className }: { name: string; className?: string }) {
  const pfad = PFADE[name];
  if (!pfad) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: pfad }}
    />
  );
}
