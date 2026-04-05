import { useState, useMemo } from "react";
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

const SORT_FIELDS = {
  name: (d) => d.name?.toLowerCase() ?? "",
  college: (d) => d.college_code?.toLowerCase() ?? "",
  school: (d) => d.school_code?.toLowerCase() ?? "",
  department: (d) => d.department_name?.toLowerCase() ?? "",
  status: (d) => d.status?.toLowerCase() ?? "",
};

function SortHeader({ label, field, sortField, sortDir, onSort }) {
  const active = sortField === field;
  return (
    <th
      onClick={() => onSort(field)}
      style={{ cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
    >
      {label}{" "}
      <span style={{ opacity: active ? 1 : 0.3, fontSize: "0.7rem" }}>
        {active ? (sortDir === "asc" ? "▲" : "▼") : "▲"}
      </span>
    </th>
  );
}

export function DelegateList({ rows, onRowClick }) {
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  function handleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => {
    const fn = SORT_FIELDS[sortField];
    if (!fn) return rows;
    return [...rows].sort((a, b) => {
      const av = fn(a);
      const bv = fn(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortField, sortDir]);

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Reg No.</th>
          <SortHeader label="Name" field="name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
          <SortHeader label="College" field="college" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
          <SortHeader label="School" field="school" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
          <SortHeader label="Department" field="department" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
          <th>Contact</th>
          <SortHeader label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
          <th>Team member</th>
          <th>Last contact</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((d, index) => (
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