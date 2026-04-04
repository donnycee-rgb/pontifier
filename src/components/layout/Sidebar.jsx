import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UserCog,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";
import { Badge } from "../ui/Badge";
import "./Sidebar.css";

const linkClass = ({ isActive }) =>
  `sidebar-link ${isActive ? "sidebar-link--active" : ""}`.trim();

export function Sidebar({ mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <>
      {mobileOpen ? <button type="button" className="sidebar-overlay" aria-label="Close menu" onClick={onCloseMobile} /> : null}
      <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-title">Campaign HQ</div>
          <div className="sidebar-brand-slogan mono">Arete in Action</div>
        </div>

        <nav className="sidebar-nav" aria-label="Main">
          {isAdmin ? (
            <NavLink to="/dashboard" className={linkClass} onClick={onCloseMobile}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          ) : null}
          <NavLink to="/register" className={linkClass} onClick={onCloseMobile}>
            <ClipboardList size={18} />
            <span>Register</span>
          </NavLink>
          <NavLink to="/delegates" className={linkClass} onClick={onCloseMobile}>
            <Users size={18} />
            <span>Delegates</span>
          </NavLink>
          {isAdmin ? (
            <NavLink to="/team" className={linkClass} onClick={onCloseMobile}>
              <UserCog size={18} />
              <span>Team</span>
            </NavLink>
          ) : null}
          <NavLink to="/account" className={linkClass} onClick={onCloseMobile}>
            <UserCircle size={18} />
            <span>My Account</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-name">{user?.name}</div>
            <Badge variant="accent" className="sidebar-role-badge">
              {user?.role?.replace("_", " ")}
            </Badge>
            {user?.college ? (
              <div className="sidebar-user-college mono">{user.college}</div>
            ) : null}
          </div>
          <button type="button" className="sidebar-logout" onClick={logout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
