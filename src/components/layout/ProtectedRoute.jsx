import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="app-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="mono" style={{ color: "var(--text2)" }}>
          Loading
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.is_first_login && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  if (roles && roles.length && !roles.includes(user.role)) {
    return <Navigate to="/register" replace />;
  }

  return children;
}
