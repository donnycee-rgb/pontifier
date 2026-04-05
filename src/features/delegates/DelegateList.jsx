import { Badge } from "../../components/ui/Badge";
import { Table } from "../../components/ui/Table";
import { formatDateOnly } from "../../utils/helpers";
import { delegateStatusLabel } from "../../utils/statusFormat";
import "./DelegateList.css";

function statusVariant(s) {
  if (s === "confirmed") return "success";
  if (s === "soft_yes") return "warning";
  if (s === "lost" || s === "cold") return "danger";
  return "muted";
}

function assigneeNames(row) {
  const a = row.assignees;
  if (!Array.isArray(a) || !a.length) return "—";
  return a.map((x) => x.name).join(", ");
}

export function DelegateList({ rows, onRowClick }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Reg No.</th>
          <th>Name</th>
          <th>College</th>
          <th>School</th>
          <th>Department</th>
          <th>Contact</th>
          <th>Status</th>
          <th>Team member</th>
          <th>Last contact</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((d, index) => (
          <tr key={d.id} className="delegate-list-row" onClick={() => onRowClick(d)}>
            <td className="mono" style={{ fontSize: "0.75rem", color: "#aaa" }}>{index + 1}</td>
            <td className="mono" style={{ fontSize: "0.75rem", color: "#aaa" }}>{d.reg_number || "—"}</td>
            <td className="delegate-list-name">{d.name}</td>
            <td className="mono">{d.college_code || d.college_name}</td>
            <td className="mono" style={{ fontSize: "0.8rem" }}>{d.school_code || "—"}</td>
            <td style={{ fontSize: "0.8rem" }}>{d.department_name || "—"}</td>
            <td className="mono delegate-list-phone">{d.contact || "—"}</td>
            <td>
              <Badge variant={statusVariant(d.status)}>{delegateStatusLabel(d.status)}</Badge>
            </td>
            <td>{assigneeNames(d)}</td>
            <td className="mono" style={{ fontSize: "0.75rem" }}>
              {d.last_contact_date ? formatDateOnly(d.last_contact_date) : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}