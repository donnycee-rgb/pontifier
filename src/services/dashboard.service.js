import { api } from "./api.js";

function unwrap(res) {
  const b = res.data;
  if (!b?.success) throw new Error(b?.message || "Request failed");
  return b.data;
}

export async function fetchDashboardStats() {
  const res = await api.get("/dashboard/stats");
  return unwrap(res);
}

export async function fetchCollegeBreakdown() {
  const res = await api.get("/dashboard/college-breakdown");
  return unwrap(res);
}

export async function fetchDailyActivity(days) {
  const res = await api.get("/dashboard/daily-activity", { params: { days } });
  return unwrap(res);
}

export async function fetchRecentActivity() {
  const res = await api.get("/dashboard/recent-activity");
  return unwrap(res);
}
export async function fetchTopCanvassers() {
  const res = await api.get("/dashboard/top-canvassers");
  return unwrap(res);
}
