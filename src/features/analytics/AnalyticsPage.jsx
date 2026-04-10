import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { api } from "../../services/api.js";
import "./AnalyticsPage.css";

function unwrap(res) {
  const b = res.data;
  if (!b?.success) throw new Error(b?.message || "Request failed");
  return b.data;
}

async function fetchBestDays() {
  const res = await api.get("/dashboard/best-days");
  return unwrap(res);
}
async function fetchCollegeResponsiveness() {
  const res = await api.get("/dashboard/college-responsiveness");
  return unwrap(res);
}
async function fetchTeamPerformance() {
  const res = await api.get("/dashboard/team-performance");
  return unwrap(res);
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function StatCard({ label, value, sub, color }) {
  return (
    <div className="analytics-stat-card card">
      <div className="analytics-stat-value" style={{ color: color || "var(--text)" }}>
        {value}
      </div>
      <div className="analytics-stat-label">{label}</div>
      {sub && <div className="analytics-stat-sub">{sub}</div>}
    </div>
  );
}

function BestDaysSection({ days }) {
  if (!days?.length) return null;
  const max = Math.max(...days.map((d) => Number(d.total_contacts)));

  return (
    <div className="analytics-section card">
      <h3 className="analytics-section-title">Best contact days</h3>
      <p className="analytics-section-sub">Which days of the week get the most contacts</p>
      <div className="analytics-days-bars">
        {DAY_NAMES.map((name, i) => {
          const d = days.find((x) => Number(x.day_num) === i);
          const total = d ? Number(d.total_contacts) : 0;
          const confirmed = d ? Number(d.confirmed_count) : 0;
          const pct = max > 0 ? (total / max) * 100 : 0;
          return (
            <div key={name} className="analytics-day-col">
              <div className="analytics-day-bar-wrap">
                <div
                  className="analytics-day-bar"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                  title={`${total} contacts, ${confirmed} confirmed`}
                />
              </div>
              <div className="analytics-day-label mono">{name}</div>
              <div className="analytics-day-count">{total}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CollegeResponsivenessSection({ colleges }) {
  if (!colleges?.length) return null;
  return (
    <div className="analytics-section card">
      <h3 className="analytics-section-title">College responsiveness</h3>
      <p className="analytics-section-sub">How many delegates have been contacted per college</p>
      <div className="analytics-resp-list">
        {colleges.map((c) => {
          const total = Number(c.total_delegates);
          const ever = Number(c.ever_contacted);
          const week = Number(c.contacted_this_week);
          const confirmed = Number(c.confirmed);
          const pct = total > 0 ? Math.round((ever / total) * 100) : 0;
          return (
            <div key={c.code} className="analytics-resp-row">
              <div className="analytics-resp-top">
                <div>
                  <span className="analytics-resp-code mono">{c.code}</span>
                  <span className="analytics-resp-name">{c.name}</span>
                </div>
                <span className="analytics-resp-pct">{pct}% reached</span>
              </div>
              <div className="analytics-resp-bar-wrap">
                <div
                  className="analytics-resp-bar"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="analytics-resp-meta">
                <span>{ever} / {total} ever contacted</span>
                <span>{week} this week</span>
                <span style={{ color: "#3ecf8e" }}>{confirmed} confirmed</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeamPerformanceSection({ members }) {
  if (!members?.length) return null;
  const maxContacts = Math.max(...members.map((m) => Number(m.total_contacts)), 1);

  return (
    <div className="analytics-section card">
      <h3 className="analytics-section-title">Team performance</h3>
      <p className="analytics-section-sub">All active users ranked by total contacts</p>
      <div className="analytics-team-table">
        <div className="analytics-team-header">
          <span>Name</span>
          <span>Role</span>
          <span>Assigned</span>
          <span>Today</span>
          <span>This week</span>
          <span>Total</span>
          <span>Confirmed</span>
        </div>
        {members.map((m, i) => {
          const total = Number(m.total_contacts);
          const pct = (total / maxContacts) * 100;
          const conversion = total > 0
            ? Math.round((Number(m.confirmed_count) / total) * 100)
            : 0;
          return (
            <div key={m.id} className="analytics-team-row">
              <div className="analytics-team-name-col">
                <span className="analytics-team-rank">#{i + 1}</span>
                <div>
                  <div className="analytics-team-name">{m.name}</div>
                  <div
                    className="analytics-team-bar"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="analytics-team-role mono">
                {String(m.role).replace("_", " ")}
              </span>
              <span className="analytics-team-cell">{Number(m.assigned_delegates)}</span>
              <span className="analytics-team-cell">{Number(m.contacts_today)}</span>
              <span className="analytics-team-cell">{Number(m.contacts_this_week)}</span>
              <span className="analytics-team-cell" style={{ fontWeight: 700 }}>{total}</span>
              <span className="analytics-team-cell" style={{ color: "#3ecf8e" }}>
                {Number(m.confirmed_count)}
                {total > 0 && (
                  <span style={{ color: "var(--text3)", fontSize: "0.7rem" }}>
                    {" "}({conversion}%)
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const { user } = useAuth();
  const [bestDays, setBestDays] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [bd, cr, tp] = await Promise.all([
          fetchBestDays(),
          fetchCollegeResponsiveness(),
          fetchTeamPerformance(),
        ]);
        if (cancelled) return;
        setBestDays(bd.days || []);
        setColleges(cr.colleges || []);
        setMembers(tp.members || []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load analytics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (user?.role !== "admin") return <Navigate to="/register" replace />;

  // Summary stats
  const totalContacts = members.reduce((s, m) => s + Number(m.total_contacts), 0);
  const totalConfirmed = members.reduce((s, m) => s + Number(m.confirmed_count), 0);
  const topPerformer = members[0];
  const mostActive = [...members].sort(
    (a, b) => Number(b.contacts_today) - Number(a.contacts_today)
  )[0];

  return (
    <div className="analytics-page">
      <h1 className="page-title">Analytics</h1>
      <p className="page-sub">Campaign performance insights · Pontifex 2026</p>

      {error ? <p className="login-error">{error}</p> : null}
      {loading ? (
        <p style={{ color: "var(--text3)", fontSize: "0.875rem" }}>Loading…</p>
      ) : null}

      {!loading && (
        <>
          {/* Summary stats */}
          <div className="analytics-stats-row">
            <StatCard
              label="Total contacts logged"
              value={totalContacts}
              color="var(--accent)"
            />
            <StatCard
              label="Total confirmed"
              value={totalConfirmed}
              color="#3ecf8e"
              sub={totalContacts > 0 ? `${Math.round((totalConfirmed / totalContacts) * 100)}% conversion` : null}
            />
            <StatCard
              label="Top performer"
              value={topPerformer?.name || "—"}
              sub={topPerformer ? `${Number(topPerformer.total_contacts)} contacts` : null}
              color="var(--accent2)"
            />
            <StatCard
              label="Most active today"
              value={mostActive?.contacts_today > 0 ? mostActive.name : "—"}
              sub={mostActive?.contacts_today > 0 ? `${Number(mostActive.contacts_today)} contacts today` : null}
            />
          </div>

          <BestDaysSection days={bestDays} />
          <CollegeResponsivenessSection colleges={colleges} />
          <TeamPerformanceSection members={members} />
        </>
      )}
    </div>
  );
}