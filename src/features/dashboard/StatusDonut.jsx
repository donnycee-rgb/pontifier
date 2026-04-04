import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./Charts.css";

const SLICES = [
  { key: "confirmed", label: "Confirmed", color: "#3ecf8e" },
  { key: "soft_yes",  label: "Soft Yes",  color: "#C9A84C" },
  { key: "cold",      label: "Cold",      color: "#6b7fa0" },
  { key: "lost",      label: "Lost",      color: "#f87171" },
];

export function StatusDonut({ stats }) {
  if (!stats) return null;

  const total = (stats.confirmed ?? 0) + (stats.soft_yes ?? 0) + (stats.cold ?? 0) + (stats.lost ?? 0);

  const data = SLICES.map((s) => ({
    name: s.label,
    value: stats[s.key] ?? 0,
    color: s.color,
  })).filter((d) => d.value > 0);

  const pct = (v) => (total > 0 ? Math.round((v / total) * 100) : 0);

  return (
    <div className="chart-card card">
      <h3 className="chart-card-title">Overall status split</h3>
      <div className="chart-donut-wrap">
        <div className="chart-donut-chart">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0a1628",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  fontSize: "0.8rem",
                }}
                formatter={(value, name) => [`${value} (${pct(value)}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-donut-center">
            <span className="chart-donut-total">{total}</span>
            <span className="chart-donut-label">total</span>
          </div>
        </div>
        <div className="chart-donut-legend">
          {SLICES.map((s) => {
            const v = stats[s.key] ?? 0;
            return (
              <div key={s.key} className="chart-donut-legend-item">
                <span className="chart-donut-legend-dot" style={{ background: s.color }} />
                <span className="chart-donut-legend-name">{s.label}</span>
                <span className="chart-donut-legend-val">{v}</span>
                <span className="chart-donut-legend-pct">{pct(v)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}