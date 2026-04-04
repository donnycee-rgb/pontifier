import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Charts.css";

function shortDate(ymd) {
  if (!ymd) return "";
  const parts = String(ymd).split("-");
  if (parts.length === 3) return `${parts[1]}-${parts[2]}`;
  return ymd;
}

export function ActivityChart({ days }) {
  const data = (days || []).map((d) => ({
    label: shortDate(d.date),
    contacts: d.total_contacts,
  }));

  return (
    <div className="chart-card card">
      <h3 className="chart-card-title">Daily contacts (last 7 days)</h3>
      <div className="chart-card-body">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="label" tick={{ fill: "#9090a8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9090a8", fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "#16161f",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
              }}
            />
            <Line type="monotone" dataKey="contacts" stroke="#9f67ff" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
