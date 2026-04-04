import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import "./AppLayout.css";

const titles = {
  "/dashboard": "Dashboard",
  "/register": "Delegate Register",
  "/delegates": "Delegates",
  "/team": "Team",
  "/account": "My Account",
};

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isChangePassword = location.pathname === "/change-password";

  if (isChangePassword) {
    return (
      <div className="app-shell app-shell--full">
        <Outlet />
      </div>
    );
  }

  const title = titles[location.pathname] || "Campaign HQ";

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="app-main app-main--with-sidebar">
        <TopBar title={title} onMenuClick={() => setMobileOpen(true)} />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
