import "./CollegeTracker.css";

const STATUS_COLORS = {
  confirmed: "#3ecf8e",
  soft_yes: "#C9A84C",
  cold: "#6366f1",
  lost: "#f87171",
};

const STATUS_LABELS = {
  confirmed: "Confirmed",
  soft_yes: "Soft Yes",
  cold: "Cold",
  lost: "Lost",
};

function ProgressBar({ confirmed, soft_yes, cold, lost }) {
  const total = confirmed + soft_yes + cold + lost;
  if (!total) return <div className="college-tracker-bar-empty" />;

  const pct = (n) => ((n / total) * 100).toFixed(1);

  return (
    <div className="college-tracker-bar">
      {confirmed > 0 && (
        <div
          className="college-tracker-bar-segment"
          style={{ width: `${pct(confirmed)}%`, background: STATUS_COLORS.confirmed }}
          title={`Confirmed: ${confirmed}`}
        />
      )}
      {soft_yes > 0 && (
        <div
          className="college-tracker-bar-segment"
          style={{ width: `${pct(soft_yes)}%`, background: STATUS_COLORS.soft_yes }}
          title={`Soft Yes: ${soft_yes}`}
        />
      )}
      {cold > 0 && (
        <div
          className="college-tracker-bar-segment"
          style={{ width: `${pct(cold)}%`, background: STATUS_COLORS.cold }}
          title={`Cold: ${cold}`}
        />
      )}
      {lost > 0 && (
        <div
          className="college-tracker-bar-segment"
          style={{ width: `${pct(lost)}%`, background: STATUS_COLORS.lost }}
          title={`Lost: ${lost}`}
        />
      )}
    </div>
  );
}

export function CollegeTracker({ colleges }) {
  if (!colleges?.length) return null;

  const grandTotal = colleges.reduce((s, c) => s + c.confirmed + c.soft_yes + c.cold + c.lost, 0);
  const grandConfirmed = colleges.reduce((s, c) => s + c.confirmed, 0);

  return (
    <div className="college-tracker card">
      <div className="college-tracker-header">
        <h3 className="chart-card-title" style={{ margin: 0 }}>Target tracker</h3>
        <div className="college-tracker-overall">
          <span className="college-tracker-overall-num" style={{ color: STATUS_COLORS.confirmed }}>
            {grandConfirmed}
          </span>
          <span className="college-tracker-overall-den"> / {grandTotal} confirmed</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <ProgressBar
        confirmed={grandConfirmed}
        soft_yes={colleges.reduce((s, c) => s + c.soft_yes, 0)}
        cold={colleges.reduce((s, c) => s + c.cold, 0)}
        lost={colleges.reduce((s, c) => s + c.lost, 0)}
      />

      <div className="college-tracker-list">
        {colleges.map((c) => {
          const total = c.confirmed + c.soft_yes + c.cold + c.lost;
          const pct = total ? Math.round((c.confirmed / total) * 100) : 0;
          return (
            <div key={c.code} className="college-tracker-row">
              <div className="college-tracker-row-top">
                <div className="college-tracker-name-wrap">
                  <span className="college-tracker-code mono">{c.code}</span>
                  <span className="college-tracker-name">{c.name}</span>
                </div>
                <div className="college-tracker-stats">
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <span key={key} className="college-tracker-stat">
                      <span
                        className="college-tracker-stat-dot"
                        style={{ background: STATUS_COLORS[key] }}
                      />
                      <span style={{ color: STATUS_COLORS[key], fontWeight: 600 }}>
                        {c[key]}
                      </span>
                      <span className="college-tracker-stat-label">{label}</span>
                    </span>
                  ))}
                  <span className="college-tracker-pct">{pct}%</span>
                </div>
              </div>
              <ProgressBar
                confirmed={c.confirmed}
                soft_yes={c.soft_yes}
                cold={c.cold}
                lost={c.lost}
              />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="college-tracker-legend">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <span key={key} className="college-tracker-legend-item">
            <span className="college-tracker-stat-dot" style={{ background: STATUS_COLORS[key] }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}