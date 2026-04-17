import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { StatsRow } from "./StatsRow";
import { CollegeChart } from "./CollegeChart";
import { ActivityChart } from "./ActivityChart";
import { StatusDonut } from "./StatusDonut";
import { TopCanvassers } from "./TopCanvassers";
import { RecentActivity } from "./RecentActivity";
import { CollegeTracker } from "./CollegeTracker";
import {
  fetchDashboardStats,
  fetchCollegeBreakdown,
  fetchDailyActivity,
  fetchRecentActivity,
  fetchTopCanvassers,
} from "../../services/dashboard.service.js";
import "./DashboardPage.css";

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [dailyDays, setDailyDays] = useState([]);
  const [recent, setRecent] = useState([]);
  const [canvassers, setCanvassers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [s, cb, da, ra, tc] = await Promise.all([
          fetchDashboardStats(),
          fetchCollegeBreakdown(),
          fetchDailyActivity(7),
          fetchRecentActivity(),
          fetchTopCanvassers(),
        ]);
        if (cancelled) return;
        setStats(s);
        setColleges(cb.colleges || []);
        setDailyDays(da.days || []);
        setRecent(ra.activity || []);
        setCanvassers(tc.canvassers || []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (user?.role !== "admin") {
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Admin dashboard</h1>
      <p className="page-sub">
        JKUSA 2026 campaign overview · {user?.name} · Arete in Action
      </p>

      {error ? <p className="login-error">{error}</p> : null}
      {loading ? (
        <p style={{ color: "var(--text3)", fontSize: "0.875rem" }}>Loading…</p>
      ) : null}

      {!loading && (
        <>
          <StatsRow stats={stats} />

          {/* Target tracker — full width */}
          <div style={{ marginTop: "1.25rem" }}>
            <CollegeTracker colleges={colleges} />
          </div>

          <div className="dashboard-grid">
            <CollegeChart colleges={colleges} />
            <ActivityChart days={dailyDays} />
          </div>

          <div className="dashboard-grid-bottom">
            <StatusDonut stats={stats} />
            <TopCanvassers canvassers={canvassers} />
          </div>

          <div className="dashboard-recent">
            <RecentActivity rows={recent} />
          </div>
        </>
      )}
    </div>
  );
}