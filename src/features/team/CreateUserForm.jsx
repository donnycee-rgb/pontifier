import { useEffect, useState } from "react";
import { fetchColleges } from "../../services/colleges.service.js";
import { createUser } from "../../services/users.service.js";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import "./CreateUserForm.css";

export function CreateUserForm({ onCreated, onCancel }) {
  const [colleges, setColleges] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("team_member");
  const [collegeId, setCollegeId] = useState("");
  const [tempPassword, setTempPassword] = useState(null);
  const [createdUser, setCreatedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchColleges()
      .then((d) => {
        const list = d.colleges || [];
        setColleges(list);
        if (list.length && !collegeId) setCollegeId(String(list[0].id));
      })
      .catch(() => setColleges([]));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const body = {
        name: name.trim(),
        email: email.trim(),
        role,
        college_id: role === "college_manager" ? Number(collegeId) : undefined,
      };
      const data = await createUser(body);
      setTempPassword(data.temporary_password);
      setCreatedUser(data.user);
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDone() {
    if (createdUser) onCreated(createdUser);
    onCancel();
  }

  return (
    <div className="create-user">
      {tempPassword && createdUser ? (
        <div className="create-user-done">
          <p className="create-user-done-title">Account created</p>
          <p className="create-user-done-text">
            Share this temporary password with the user once. It will not be shown again after you close this dialog.
          </p>
          <div className="create-user-pw mono">{tempPassword}</div>
          <Button type="button" onClick={handleDone}>
            Done
          </Button>
        </div>
      ) : (
        <form className="create-user-form" onSubmit={handleSubmit}>
          {error ? <p className="login-error">{error}</p> : null}
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label className="create-user-label">
            <span>Role</span>
            <select className="create-user-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">admin</option>
              <option value="college_manager">college_manager</option>
              <option value="team_member">team_member</option>
            </select>
          </label>
          {role === "college_manager" ? (
            <label className="create-user-label">
              <span>College</span>
              <select
                className="create-user-select"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                required
              >
                {colleges.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="create-user-actions">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating" : "Create user"}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
