import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { fetchUsers, deactivateUser, activateUser } from "../../services/users.service.js";
import { TeamMemberCard } from "./TeamMemberCard";
import { CreateUserForm } from "./CreateUserForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import "./TeamPage.css";

export function TeamPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchUsers();
      setMembers(data.users || []);
    } catch (e) {
      setError(e.message || "Failed to load team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (user?.role !== "admin") {
    return <Navigate to="/register" replace />;
  }

  async function onDeactivate(id) {
    try {
      await deactivateUser(id);
      await load();
    } catch (e) {
      setError(e.message || "Deactivate failed");
    }
  }

  async function onActivate(id) {
    try {
      await activateUser(id);
      await load();
    } catch (e) {
      setError(e.message || "Activate failed");
    }
  }

  function onCreated() {
    load();
  }

  return (
    <div className="team-page">
      <div className="team-page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-sub">Manage campaign accounts · Javaas Abich has full admin access</p>
        </div>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          New user
        </Button>
      </div>

      {error ? <p className="login-error">{error}</p> : null}
      {loading ? <p>Loading</p> : null}

      {!loading ? (
        <div className="team-grid">
          {members.map((m) => (
            <TeamMemberCard
              key={m.id}
              member={m}
              currentUserId={user?.id}
              onDeactivate={onDeactivate}
              onActivate={onActivate}
            />
          ))}
        </div>
      ) : null}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create user">
        <CreateUserForm
          onCreated={onCreated}
          onCancel={() => {
            setCreateOpen(false);
            load();
          }}
        />
      </Modal>
    </div>
  );
}
