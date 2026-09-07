import { db } from "@/lib/db";
import { kontaktStatusAction, kontaktLoeschenAction } from "@/app/admin/actions";

type Anfrage = {
  id: number;
  created_at: string;
  thema: string;
  vorname: string;
  nachname: string;
  alter_jahre: string;
  email: string;
  telefon: string;
  nachricht: string;
  status: string;
};

export const metadata = { title: "Kontaktanfragen" };

export default function KontaktSeite() {
  const anfragen = db()
    .prepare("SELECT * FROM kontakt ORDER BY id DESC LIMIT 500")
    .all() as Anfrage[];

  return (
    <>
      <h1>Kontaktanfragen</h1>
      <div className="admin-card">
        {anfragen.length === 0 ? (
          <p className="a-hinweis">Noch keine Anfragen über das Kontaktformular.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-tabelle">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Status</th>
                  <th>Thema</th>
                  <th>Name</th>
                  <th>Kontakt</th>
                  <th>Nachricht</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {anfragen.map((a) => (
                  <tr key={a.id}>
                    <td>{a.created_at.replace("T", " ").slice(0, 16)}</td>
                    <td>
                      <span className={`badge ${a.status === "neu" ? "badge--neu" : "badge--ok"}`}>
                        {a.status === "neu" ? "Neu" : "Erledigt"}
                      </span>
                    </td>
                    <td>{a.thema || "—"}</td>
                    <td>
                      <strong>
                        {a.vorname} {a.nachname}
                      </strong>
                      {a.alter_jahre ? <> ({a.alter_jahre})</> : null}
                    </td>
                    <td>
                      <a href={`mailto:${a.email}`}>{a.email}</a>
                      <br />
                      <a href={"tel:" + a.telefon.replace(/[^\d+]/g, "")}>{a.telefon}</a>
                    </td>
                    <td style={{ maxWidth: 320, whiteSpace: "pre-wrap" }}>{a.nachricht || "—"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <form action={kontaktStatusAction} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={a.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={a.status === "neu" ? "kontaktiert" : "neu"}
                        />
                        <button className="a-btn" type="submit">
                          {a.status === "neu" ? "✓ Erledigt" : "↩ Als neu"}
                        </button>
                      </form>{" "}
                      <form action={kontaktLoeschenAction} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={a.id} />
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
