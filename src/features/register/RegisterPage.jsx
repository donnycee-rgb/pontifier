import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../auth/AuthContext";
import { fetchRegister, postRegisterEntry } from "../../services/register.service.js";
import { fetchColleges } from "../../services/colleges.service.js";
import { todayYmd } from "../../utils/helpers";
import { RegisterTable } from "./RegisterTable";
import "./RegisterPage.css";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function RegisterPage() {
  const { user, token } = useAuth();
  const [delegates, setDelegates] = useState([]);
  const [dates, setDates] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [pendingByDelegate, setPendingByDelegate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (collegeFilter !== "all") params.college_id = collegeFilter;
      const data = await fetchRegister(params);
      setDelegates(data.delegates || []);
      setDates(data.dates || []);
    } catch (e) {
      setError(e.message || "Failed to load register");
    } finally {
      setLoading(false);
    }
  }, [collegeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetchColleges()
      .then((d) => setColleges(d.colleges || []))
      .catch(() => {});
  }, [user?.role]);

  useEffect(() => {
    if (!token) return;
    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socket.on("register_updated", () => {
      load();
    });
    return () => {
      socket.disconnect();
    };
  }, [token, load]);

  useEffect(() => {
    let lastDay = todayYmd();
    const checkDayChange = setInterval(() => {
      const now = todayYmd();
      if (now !== lastDay) {
        lastDay = now;
        load();
      }
    }, 60000);
    return () => clearInterval(checkDayChange);
  }, [load]);

  const onRequestTick = useCallback((delegateId) => {
    setPendingByDelegate((p) => ({ ...p, [delegateId]: true }));
  }, []);

  const onSelectOutcome = useCallback(
    async (delegateId, outcome) => {
      const today = todayYmd();
      try {
        await postRegisterEntry({
          delegate_id: delegateId,
          contact_date: today,
          was_contacted: true,
          outcome,
          notes: null,
        });
        setPendingByDelegate((p) => {
          const next = { ...p };
          delete next[delegateId];
          return next;
        });
        await load();
      } catch (e) {
        setError(e.message || "Failed to save entry");
        setPendingByDelegate((p) => {
          const next = { ...p };
          delete next[delegateId];
          return next;
        });
      }
    },
    [load]
  );

  const showCollegeFilter = user?.role === "admin";

  return (
    <div className="register-page">
      <h1 className="page-title">Delegate register</h1>
      <p className="page-sub">
        Daily contact sheet · Today is the rightmost column · Tick and record outcome for each delegate you reach.
      </p>

      {error ? <p className="login-error">{error}</p> : null}

      <div className="register-toolbar panel">
        {showCollegeFilter ? (
          <label className="register-filter">
            <span className="register-filter-label mono">College</span>
            <select
              className="register-filter-select"
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
            >
              <option value="all">All colleges</option>
              {colleges.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.code}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="register-scope mono">
            {user?.role === "college_manager"
              ? `Scope: ${user.college_code || user.college_name || "your college"}`
              : "Scope: your assigned delegates"}
          </p>
        )}
        <p className="register-hint mono">{delegates.length} delegates in view</p>
      </div>

      {loading ? <p>Loading</p> : null}

      {!loading ? (
        <RegisterTable
          dates={dates}
          todayStr={todayYmd()}
          delegates={delegates}
          pendingByDelegate={pendingByDelegate}
          onRequestTick={onRequestTick}
          onSelectOutcome={onSelectOutcome}
          readOnly={false}
        />
      ) : null}
    </div>
  );
}