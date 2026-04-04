import { Table } from "../../components/ui/Table";
import { formatDateTime } from "../../utils/helpers";
import { outcomeLabel } from "../../utils/statusFormat";

export function RecentActivity({ rows }) {
  const list = rows || [];

  return (
    <div className="card">
      <h3 className="chart-card-title">Recent register activity</h3>
      <Table>
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Delegate</th>
            <th>Action</th>
            <th>Outcome</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ color: "var(--text2)" }}>
                No activity yet.
              </td>
            </tr>
          ) : null}
          {list.map((r) => (
            <tr key={r.id}>
              <td className="mono" style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
                {formatDateTime(r.created_at)}
              </td>
              <td>{r.contacted_by_name || "—"}</td>
              <td>
                {r.delegate_name}
                {r.college_name ? <span className="mono" style={{ color: "var(--text3)", marginLeft: 6 }}>{r.college_name}</span> : null}
              </td>
              <td className="mono" style={{ fontSize: "0.75rem" }}>
                {r.was_contacted ? "Contact" : "Logged"}
              </td>
              <td>{r.outcome ? outcomeLabel(r.outcome) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
