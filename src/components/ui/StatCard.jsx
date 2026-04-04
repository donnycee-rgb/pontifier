import "./StatCard.css";

export function StatCard({ label, value, sub, mono }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className={`stat-card-value ${mono ? "mono" : ""}`}>{value}</div>
      {sub ? <div className="stat-card-sub">{sub}</div> : null}
    </div>
  );
}
