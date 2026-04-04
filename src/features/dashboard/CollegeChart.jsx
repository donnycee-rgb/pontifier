import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Charts.css";

const COLORS = {
  Confirmed: "#10b981",
  "Soft Yes": "#f59e0b",
  Cold: "#6366f1",
  Lost: "#7c3aed",
};

export function CollegeChart({ colleges }) {
  const data = (colleges || []).map((c) => ({
    college: c.code,
    Confirmed: c.confirmed,
    "Soft Yes": c.soft_yes,
    Cold: c.cold,
    Lost: c.lost,
  }));

  if (!data.length) {
    return (
      <div className="chart-card card">
        <h3 className="chart-card-title">Status by college</h3>
        <p className="chart-card-body" style={{ padding: "1rem", color: "var(--text2)" }}>
          No college data yet.
        </p>
      </div>
    );
  }

  return (
    <div className="chart-card card">
      <h3 className="chart-card-title">Status by college</h3>
      <div className="chart-card-body">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="college" tick={{ fill: "#9090a8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9090a8", fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "#16161f",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
              }}
              labelStyle={{ color: "#f0f0f5" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {Object.keys(COLORS).map((key) => (
              <Bar key={key} dataKey={key} stackId="a" fill={COLORS[key]} radius={[0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
