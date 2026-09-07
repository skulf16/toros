/**
 * Button zur Fahrschulmanager-Online-Anmeldung.
 * Der authenticate-Endpunkt akzeptiert nur POST (GET antwortet mit 401
 * „No API key provided“) und leitet dann auf die Anmeldestrecke weiter —
 * deshalb ein Formular statt eines Links.
 */
export default function AnmeldungButton({
  url,
  className,
  children,
}: {
  url: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <form action={url} method="POST" style={{ display: "inline" }}>
      <button className={className} type="submit">
        {children}
      </button>
    </form>
  );
}
