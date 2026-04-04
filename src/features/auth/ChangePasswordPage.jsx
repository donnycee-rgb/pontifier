import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { passwordStrength } from "../../utils/helpers";
import { changePasswordRequest } from "../../services/auth.service.js";
import "./ChangePasswordPage.css";

export function ChangePasswordPage() {
  const { user, updateUser, isAuthenticated, ready, setSessionFromAuthPayload } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (ready && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (ready && user && !user.is_first_login) {
    return <Navigate to={user.role === "admin" ? "/dashboard" : "/register"} replace />;
  }

  const strength = passwordStrength(next);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (next !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    setLoading(true);
    try {
      const data = await changePasswordRequest(current, next, confirm);
      setSessionFromAuthPayload(data);
      updateUser({ is_first_login: false });
      navigate(user?.role === "admin" ? "/dashboard" : "/register", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="change-pw-page">
      <div className="change-pw-card card">
        <h1 className="change-pw-title">Change password required</h1>
        <p className="change-pw-lead">
          For security, you must set a new password before you can use Campaign HQ. This step cannot be skipped.
        </p>

        <form className="change-pw-form" onSubmit={handleSubmit}>
          <Input label="Current password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          <Input label="New password" type="password" value={next} onChange={(e) => setNext(e.target.value)} required />
          <div className="change-pw-strength">
            <div className="change-pw-strength-bar">
              <div
                className="change-pw-strength-fill"
                style={{
                  width: `${Math.min(100, (strength.score / 5) * 100)}%`,
                  background: strength.color,
                }}
              />
            </div>
            <span className="mono change-pw-strength-label" style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>
          <Input label="Confirm new password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          {error ? <p className="change-pw-error">{error}</p> : null}
          <Button type="submit" className="change-pw-submit" disabled={loading}>
            {loading ? "Saving" : "Update password and continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
