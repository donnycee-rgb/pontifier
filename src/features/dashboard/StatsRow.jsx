import { StatCard } from "../../components/ui/StatCard";
import "./StatsRow.css";

export function StatsRow({ stats }) {
  if (!stats) return null;
  const coldOrLost = (stats.cold ?? 0) + (stats.lost ?? 0);
  return (
    <div className="stats-row">
      <StatCard label="Total Delegates" value={stats.total_delegates} mono />
      <StatCard label="Confirmed" value={stats.confirmed} mono />
      <StatCard label="Soft Yes" value={stats.soft_yes} mono />
      <StatCard label="Cold or Lost" value={coldOrLost} mono />
      <StatCard label="Contact Rate Today" value={`${stats.contact_rate_today}%`} mono />
    </div>
  );
}
