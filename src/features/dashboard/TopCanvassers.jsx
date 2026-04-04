import "./TopCanvassers.css";

export function TopCanvassers({ canvassers }) {
  const list = canvassers || [];
  const max = list[0]?.contacts_total || 1;

  return (
    <div className="card top-canvassers">
      <h3 className="chart-card-title">Top canvassers</h3>
      {list.length === 0 ? (
        <p className="top-canvassers-empty">No canvassing data yet.</p>
      ) : (
        <ol className="top-canvassers-list">
          {list.map((c, i) => {
            const pct = Math.round((c.contacts_total / max) * 100);
            const confirmRate = c.contacts_total > 0
              ? Math.round((c.confirmed_count / c.contacts_total) * 100)
              : 0;
            return (
              <li key={c.user_id} className="top-canvassers-item">
                <span className={`top-canvassers-rank top-canvassers-rank--${i + 1}`}>
                  {i + 1}
                </span>
                <div className="top-canvassers-info">
                  <div className="top-canvassers-name-row">
                    <span className="top-canvassers-name">{c.name}</span>
                    <span className="top-canvassers-college">{c.college}</span>
                  </div>
                  <div className="top-canvassers-bar-wrap">
                    <div className="top-canvassers-bar">
                      <div
                        className="top-canvassers-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="top-canvassers-stats">
                  <span className="top-canvassers-count">{c.contacts_total}</span>
                  <span className="top-canvassers-sub">{confirmRate}% confirmed</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}