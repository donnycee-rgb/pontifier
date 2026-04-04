import "./Table.css";

export function Table({ children, className = "" }) {
  return (
    <div className="ui-table-scroll">
      <table className={`ui-table ${className}`.trim()}>{children}</table>
    </div>
  );
}
