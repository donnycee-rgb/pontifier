import { formatDateOnly, formatDateTime } from "../../utils/helpers";
import { outcomeLabel, delegateStatusLabel } from "../../utils/statusFormat";
import "./ContactHistory.css";

export function ContactHistory({ contacts, statusHistory }) {
  const cList = contacts || [];
  const sList = statusHistory || [];

  return (
    <div className="contact-history">
      <section>
        <h4 className="contact-history-title">Contact history</h4>
        <ul className="contact-history-list">
          {cList.length === 0 ? (
            <li className="contact-history-empty">No logged contacts yet.</li>
          ) : (
            cList.map((row) => (
              <li key={row.id} className="contact-history-item">
                <span className="mono contact-history-date">{formatDateOnly(row.contact_date)}</span>
                <span className="contact-history-outcome">
                  {row.was_contacted ? outcomeLabel(row.outcome) || "Contacted" : "Not contacted"}
                </span>
                <span className="contact-history-by mono">by {row.contacted_by_name || "—"}</span>
              </li>
            ))
          )}
        </ul>
      </section>
      <section>
        <h4 className="contact-history-title">Status history</h4>
        <ul className="contact-history-list">
          {sList.length === 0 ? (
            <li className="contact-history-empty">No status changes recorded.</li>
          ) : (
            sList.map((s) => (
              <li key={s.id} className="contact-history-item">
                <span className="mono contact-history-date">{formatDateTime(s.changed_at)}</span>
                <span>
                  {delegateStatusLabel(s.old_status)} to {delegateStatusLabel(s.new_status)}
                </span>
                <span className="contact-history-by mono">by {s.changed_by_name || "—"}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
