import "./Button.css";

export function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  disabled,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`ui-btn ui-btn--${variant} ${className}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
