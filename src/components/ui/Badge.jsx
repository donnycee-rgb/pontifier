import "./Badge.css";

const variantClass = {
  default: "ui-badge--default",
  success: "ui-badge--success",
  warning: "ui-badge--warning",
  danger: "ui-badge--danger",
  muted: "ui-badge--muted",
  accent: "ui-badge--accent",
};

export function Badge({ children, variant = "default", className = "" }) {
  return (
    <span className={`ui-badge ${variantClass[variant] || variantClass.default} ${className}`.trim()}>
      {children}
    </span>
  );
}
