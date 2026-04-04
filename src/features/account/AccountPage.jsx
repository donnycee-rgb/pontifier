import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { passwordStrength } from "../../utils/helpers";
import "./AccountPage.css";

export function AccountPage() {
  const { user } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const strength = passwordStrength(next);

  function handlePasswordChange(e) {
    e.preventDefault();
    setMsg("");
    if (next.length < 8) {
      setMsg("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }
    setMsg("Password updated (mock). Backend will persist this later.");
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <div className="account-page">
      <h1 className="page-title">My account</h1>
      <p className="page-sub">Profile and security · role and email are managed by an administrator</p>

      <div className="account-grid">
        <section className="card account-profile">
          <h2 className="account-section-title">Profile</h2>
          <dl className="account-dl">
            <div>
              <dt>Name</dt>
              <dd>{user?.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd className="mono">{user?.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>
                <Badge variant="accent">{user?.role?.replace("_", " ")}</Badge>
              </dd>
            </div>
            {user?.college ? (
              <div>
                <dt>College</dt>
                <dd className="mono">{user.college}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="card account-security">
          <h2 className="account-section-title">Change password</h2>
          <form className="account-pw-form" onSubmit={handlePasswordChange}>
            <Input label="Current password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
            <Input label="New password" type="password" value={next} onChange={(e) => setNext(e.target.value)} />
            <div className="account-strength">
              <div className="account-strength-bar">
                <div
                  className="account-strength-fill"
                  style={{
                    width: `${Math.min(100, (strength.score / 5) * 100)}%`,
                    background: strength.color,
                  }}
                />
              </div>
              <span className="mono account-strength-label" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
            <Input label="Confirm new password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            {msg ? <p className={msg.includes("mock") ? "account-msg account-msg--ok" : "account-msg"}>{msg}</p> : null}
            <Button type="submit">Update password</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
