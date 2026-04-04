import "./Input.css";

export function Input({
  label,
  id,
  error,
  className = "",
  wrapperClass = "",
  ...rest
}) {
  const inputId = id || rest.name;
  return (
    <div className={`ui-input-wrap ${wrapperClass}`.trim()}>
      {label ? (
        <label htmlFor={inputId} className="ui-input-label">
          {label}
        </label>
      ) : null}
      <input id={inputId} className={`ui-input ${error ? "ui-input--error" : ""} ${className}`.trim()} {...rest} />
      {error ? <span className="ui-input-error">{error}</span> : null}
    </div>
  );
}
