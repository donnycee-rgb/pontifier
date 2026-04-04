import { Menu } from "lucide-react";
import "./TopBar.css";

export function TopBar({ onMenuClick, title }) {
  return (
    <header className="topbar">
      <button type="button" className="topbar-menu" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>
      {title ? <h1 className="topbar-title">{title}</h1> : null}
    </header>
  );
}
