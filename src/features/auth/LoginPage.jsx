import { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "./AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import "./LoginPage.css";

export function LoginPage() {
  const { login, isAuthenticated, user, ready } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (ready && isAuthenticated && user && !user.is_first_login) {
    const dest =
      from && from !== "/login"
        ? from
        : user.role === "admin"
          ? "/dashboard"
          : "/register";
    return <Navigate to={dest} replace />;
  }

  if (ready && isAuthenticated && user?.is_first_login) {
    return <Navigate to="/change-password" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user: u, requiresPasswordChange } = await login(email, password);
      if (requiresPasswordChange || u.is_first_login) {
        navigate("/change-password", { replace: true });
      } else if (u.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/register", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card-wrap">
        <div className="login-card">
          <h1 className="login-title">Campaign HQ</h1>
          <p className="login-sub">Javaas Abich</p>
          <p className="login-slogan mono">Arete in Action</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="login-password-wrap">
              <Input
                label="Password"
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="login-toggle-eye"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error ? <p className="login-error">{error}</p> : null}
            <Button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in" : "Login"}
            </Button>
          </form>

          <p className="login-hint mono">
            JKUSA 2026 · Seeded admin: admin@campaign.com (password in server seed.sql)
          </p>
        </div>
      </div>
    </div>
  );
}
