import { useState, useEffect } from "react";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ContactHistory } from "./ContactHistory";
import {
  fetchDelegateById,
  updateDelegateStatus,
  assignDelegate,
  patchDelegate,
} from "../../services/delegates.service.js";
import { fetchUsers } from "../../services/users.service.js";
import { formatDateOnly } from "../../utils/helpers";
import { delegateStatusLabel, delegateStatusOptions } from "../../utils/statusFormat";
import "./DelegatePanel.css";

function statusVariant(s) {
  if (s === "confirmed") return "success";
  if (s === "soft_yes") return "warning";
  if (s === "lost" || s === "cold") return "danger";
  return "muted";
}

export function DelegatePanel({ open, onClose, delegateSummary, user, onUpdated }) {
  const [detail, setDetail] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !delegateSummary?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchDelegateById(delegateSummary.id);
        if (cancelled) return;
        setDetail(data);
        setNote(data.delegate?.notes || "");
        setStatus(data.delegate?.status || "");
        setAssignTo("");
        if (user?.role === "admin") {
          const udata = await fetchUsers({ role: "team_member", is_active: "true" });
          if (!cancelled) setTeamMembers(udata.users || []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load delegate");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, delegateSummary?.id, user?.role]);

  const delegate = detail?.delegate;
  const canEditStatus = user?.role === "admin" || user?.role === "college_manager";
  const isAdmin = user?.role === "admin";

  async function saveNotes() {
    if (!delegate) return;
    await patchDelegate(delegate.id, { notes: note });
    onUpdated?.();
  }

  async function saveStatus() {
    if (!delegate || !status) return;
    await updateDelegateStatus(delegate.id, status, null);
    onUpdated?.();
    onClose();
  }

  async function saveAssign() {
    if (!delegate || !assignTo) return;
    await assignDelegate(delegate.id, assignTo);
    onUpdated?.();
    const data = await fetchDelegateById(delegate.id);
    setDetail(data);
    setAssignTo("");
  }

  if (!delegateSummary) return null;

  return (
    <Modal open={open} onClose={onClose} title={delegateSummary.name} wide>
      {loading ? <p className="delegate-panel-loading">Loading</p> : null}
      {error ? <p className="change-pw-error">{error}</p> : null}
      {delegate ? (
        <div className="delegate-panel">

          {/* Status + College badges */}
          <div className="delegate-panel-row">
            <Badge variant="accent">{delegateSummary.college_name || delegate.college_name}</Badge>
            <Badge variant={statusVariant(delegate.status)}>{delegateStatusLabel(delegate.status)}</Badge>
          </div>

          {/* Academic breadcrumb: College → School → Department */}
          <div className="delegate-panel-breadcrumb">
            <span className="delegate-panel-breadcrumb-item">
              {delegate.college_name || delegateSummary.college_name || "—"}
            </span>
            {delegate.school_name && (
              <>
                <span className="delegate-panel-breadcrumb-sep">›</span>
                <span className="delegate-panel-breadcrumb-item">{delegate.school_name}</span>
              </>
            )}
            {delegate.department_name && (
              <>
                <span className="delegate-panel-breadcrumb-sep">›</span>
                <span className="delegate-panel-breadcrumb-item delegate-panel-breadcrumb-dept">
                  {delegate.department_name}
                </span>
              </>
            )}
          </div>

          {/* Reg number */}
          {delegate.reg_number && (
            <p className="delegate-panel-meta">
              Reg No: <span className="mono">{delegate.reg_number}</span>
            </p>
          )}

          <p className="delegate-panel-phone mono">{delegate.contact || "—"}</p>

          <p className="delegate-panel-meta">
            Assigned:{" "}
            <span className="mono">
              {(detail.assignees || []).map((a) => a.name).join(", ") || "Unassigned"}
            </span>
          </p>
          <p className="delegate-panel-meta">
            Last contacted:{" "}
            <span className="mono">
              {delegateSummary.last_contact_date
                ? formatDateOnly(delegateSummary.last_contact_date)
                : "—"}
            </span>
          </p>

          <ContactHistory contacts={detail.contacts} statusHistory={detail.status_history} />

          <div className="delegate-panel-notes">
            <label className="delegate-panel-notes-label">Notes</label>
            <textarea
              className="delegate-panel-textarea"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => { saveNotes().catch(() => {}); }}
            />
          </div>

          {canEditStatus ? (
            <div className="delegate-panel-edit">
              <label className="delegate-panel-notes-label">Update status</label>
              <div className="delegate-panel-edit-row">
                <select
                  className="delegate-panel-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {delegateStatusOptions().map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <Button type="button" onClick={() => saveStatus().catch((e) => setError(e.message))}>
                  Save status
                </Button>
              </div>
            </div>
          ) : null}

          {isAdmin ? (
            <div className="delegate-panel-edit">
              <label className="delegate-panel-notes-label">Assign to team member</label>
              <div className="delegate-panel-edit-row">
                <select
                  className="delegate-panel-select"
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                >
                  <option value="">Select member</option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => saveAssign().catch((e) => setError(e.message))}
                >
                  Assign
                </Button>
              </div>
            </div>
          ) : null}

          <div className="delegate-panel-footer">
            <Button variant="ghost" type="button" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}