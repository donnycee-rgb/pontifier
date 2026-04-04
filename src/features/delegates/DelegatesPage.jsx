import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  fetchDelegates,
  createDelegate,
  importDelegates,
  exportDelegates,
  downloadDelegateTemplate,
} from "../../services/delegates.service.js";
import { fetchColleges } from "../../services/colleges.service.js";
import { DelegateList } from "./DelegateList";
import { DelegatePanel } from "./DelegatePanel";
import { DelegateForm } from "./DelegateForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import "./DelegatesPage.css";

export function DelegatesPage() {
  const { user } = useAuth();
  const [delegates, setDelegates] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [college, setCollege] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [importing, setImporting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const fileInputRef = useRef(null);

  const isAdminOrManager = user?.role === "admin" || user?.role === "college_manager";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (college !== "all") params.college_id = college;
      if (status !== "all") params.status = status;
      const data = await fetchDelegates(params);
      setDelegates(data.delegates || []);
    } catch (e) {
      setError(e.message || "Failed to load delegates");
    } finally {
      setLoading(false);
    }
  }, [search, college, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetchColleges()
      .then((d) => setColleges(d.colleges || []))
      .catch(() => {});
  }, [user?.role]);

  const filtered = useMemo(() => delegates, [delegates]);

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportStatus("");
    try {
      const result = await importDelegates(file);
      setImportStatus(`✓ Imported ${result.inserted} delegate(s). ${result.skipped ? `${result.skipped} skipped.` : ""}`);
      load();
    } catch (err) {
      setImportStatus(`✗ ${err.message || "Import failed"}`);
    } finally {
      setImporting(false);
      fileInputRef.current.value = "";
    }
  }

  async function handleExport(format) {
    try {
      await exportDelegates(format);
    } catch (err) {
      setError(err.message || "Export failed");
    } finally {
      setExportOpen(false);
    }
  }

  async function handleTemplate() {
    try {
      await downloadDelegateTemplate();
    } catch (err) {
      setError(err.message || "Failed to download template");
    }
  }

  return (
    <div className="delegates-page">
      <div className="delegates-header">
        <div>
          <h1 className="page-title">Delegates</h1>
          <p className="page-sub">Search and open a profile · data from Campaign HQ API</p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Import/Export buttons for admin and college_manager */}
          {isAdminOrManager && (
            <>
              <Button type="button" onClick={handleTemplate} style={{ background: "transparent", border: "1px solid #555" }}>
                ↓ Template
              </Button>

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                style={{ background: "transparent", border: "1px solid #555" }}
              >
                {importing ? "Importing…" : "↑ Import Excel"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={handleImport}
              />

              <div style={{ position: "relative" }}>
                <Button
                  type="button"
                  onClick={() => setExportOpen((o) => !o)}
                  style={{ background: "transparent", border: "1px solid #555" }}
                >
                  ↓ Export ▾
                </Button>
                {exportOpen && (
                  <div style={{
                    position: "absolute", right: 0, top: "110%", background: "#1e1e1e",
                    border: "1px solid #333", borderRadius: "6px", zIndex: 10, minWidth: "130px"
                  }}>
                    <button
                      onClick={() => handleExport("csv")}
                      style={{ display: "block", width: "100%", padding: "0.6rem 1rem", background: "none", border: "none", color: "#fff", cursor: "pointer", textAlign: "left" }}
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport("xlsx")}
                      style={{ display: "block", width: "100%", padding: "0.6rem 1rem", background: "none", border: "none", color: "#fff", cursor: "pointer", textAlign: "left" }}
                    >
                      Export as Excel
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Add delegate — admin only */}
          {user?.role === "admin" && (
            <Button type="button" onClick={() => setAddOpen(true)}>
              Add delegate
            </Button>
          )}
        </div>
      </div>

      {importStatus && (
        <p style={{ color: importStatus.startsWith("✓") ? "#4caf50" : "#f44336", marginBottom: "0.5rem" }}>
          {importStatus}
        </p>
      )}
      {error ? <p className="login-error">{error}</p> : null}
      {loading ? <p className="delegates-loading">Loading</p> : null}

      <div className="delegates-filters panel">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          wrapperClass="delegates-search"
        />
        <label className="delegates-filter">
          <span className="mono">College</span>
          <select
            className="delegates-select"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            disabled={user?.role === "college_manager"}
          >
            <option value="all">All</option>
            {colleges.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.code}
              </option>
            ))}
          </select>
        </label>
        <label className="delegates-filter">
          <span className="mono">Status</span>
          <select className="delegates-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="soft_yes">Soft Yes</option>
            <option value="cold">Cold</option>
            <option value="lost">Lost</option>
          </select>
        </label>
      </div>

      {!loading ? <DelegateList rows={filtered} onRowClick={setSelected} /> : null}

      <DelegatePanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        delegateSummary={selected}
        user={user}
        onUpdated={load}
      />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New delegate">
        <DelegateForm
          colleges={colleges}
          onSubmit={async (payload) => {
            await createDelegate(payload);
            setAddOpen(false);
            load();
          }}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>
    </div>
  );
}