import { Badge } from "../../components/ui/Badge";
import { RegisterCell } from "./RegisterCell";
import { formatDateOnly } from "../../utils/helpers";
import { delegateStatusLabel } from "../../utils/statusFormat";
import "./RegisterTable.css";

function statusVariant(s) {
  if (s === "confirmed") return "success";
  if (s === "soft_yes") return "warning";
  if (s === "lost" || s === "cold") return "danger";
  return "muted";
}

export function RegisterTable({
  dates,
  todayStr,
  delegates,
  pendingByDelegate,
  onRequestTick,
  onSelectOutcome,
  readOnly,
}) {
  return (
    <div className="register-table-wrap">
      <table className="register-table">
        <thead>
          <tr>
            <th className="register-table-sticky register-table-name-head">
              Delegate
            </th>
            {dates.map((d) => (
              <th key={d} className="register-table-date-head mono">
                {d === todayStr ? (
                  <span className="register-today-pill">Today</span>
                ) : null}
                {formatDateOnly(d)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {delegates.map((del) => (
            <tr key={del.id}>
              <td className="register-table-sticky register-table-name">
                <div className="register-name-row">
                  <Badge variant={statusVariant(del.status)}>
                    {delegateStatusLabel(del.status)}
                  </Badge>
                  <span className="register-name-text">{del.name}</span>
                </div>
                <div className="register-name-meta mono">{del.college}</div>
              </td>
              {dates.map((d) => {
                const isToday = d === todayStr;
                const entry = del.entries?.[d] || null;
                const myEntry =
                  isToday && entry?.has_my_entry
                    ? { was_contacted: true, outcome: entry.outcome }
                    : null;
                return (
                  <td key={`${del.id}-${d}`} className="register-table-cell">
                    <RegisterCell
                      isToday={isToday}
                      readOnly={readOnly}
                      displayEntry={entry}
                      myEntry={myEntry}
                      pendingTick={pendingByDelegate[del.id]}
                      onRequestTick={() => onRequestTick(del.id)}
                      onSelectOutcome={(outcome) =>
                        onSelectOutcome(del.id, outcome)
                      }
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}