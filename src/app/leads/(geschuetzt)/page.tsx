import { db } from "@/lib/db";
import { leadStatusAction, leadLoeschenAction, leadMailErneutSendenAction } from "@/app/admin/actions";

type Lead = {
  id: number;
  created_at: string;
  kategorie: string;
  klasse: string;
  startwunsch: string;
  altersgruppe: string;
  vorname: string;
  nachname: string;
  telefon: string;
  email: string;
  consent: number;
  status: string;
};

export const metadata = { title: "Leads" };

export default async function LeadsSeite({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; fehler?: string }>;
}) {
  const params = await searchParams;
  const leads = db()
    .prepare("SELECT * FROM leads ORDER BY id DESC LIMIT 500")
    .all() as Lead[];
  const neu = leads.filter((l) => l.status === "neu").length;

  return (
    <>
      <h1>
        Leads {neu > 0 ? <span className="badge badge--neu">{neu} neu</span> : null}
      </h1>
      {params.ok ? <div className="a-meldung">{params.ok}</div> : null}
      {params.fehler ? <div className="a-fehler">{params.fehler}</div> : null}
      <div className="admin-card">
        {leads.length === 0 ? (
          <p className="a-hinweis">Noch keine Leads — sobald jemand den Führerschein-Check absendet, erscheint er hier.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-tabelle">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Telefon</th>
                  <th>E-Mail</th>
                  <th>Kategorie</th>
                  <th>Klasse</th>
                  <th>Start</th>
                  <th>Alter</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td>{l.created_at.replace("T", " ").slice(0, 16)}</td>
                    <td>
                      <span className={`badge ${l.status === "neu" ? "badge--neu" : "badge--ok"}`}>
                        {l.status === "neu" ? "Neu" : "Kontaktiert"}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {l.vorname} {l.nachname}
                      </strong>
                    </td>
                    <td>
                      <a href={"tel:" + l.telefon.replace(/[^\d+]/g, "")}>{l.telefon}</a>
                    </td>
                    <td>{l.email ? <a href={`mailto:${l.email}`}>{l.email}</a> : "—"}</td>
                    <td>{l.kategorie}</td>
                    <td>{l.klasse}</td>
                    <td>{l.startwunsch}</td>
                    <td>{l.altersgruppe}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <form action={leadStatusAction} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={l.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={l.status === "neu" ? "kontaktiert" : "neu"}
                        />
                        <button className="a-btn" type="submit">
                          {l.status === "neu" ? "✓ Kontaktiert" : "↩ Als neu"}
                        </button>
                      </form>{" "}
                      <form action={leadMailErneutSendenAction} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={l.id} />
                        <button className="a-btn" type="submit" title="Benachrichtigungs-Mail erneut verschicken">
                          ✉ Mail erneut
                        </button>
                      </form>{" "}
                      <form action={leadLoeschenAction} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={l.id} />
                        <button className="a-btn a-btn--rot" type="submit">
                          Löschen
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
