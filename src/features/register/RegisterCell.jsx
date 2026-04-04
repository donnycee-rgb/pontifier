import { Check } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { outcomeLabel } from "../../utils/statusFormat";
import "./RegisterCell.css";

function outcomeVariant(o) {
  if (o === "confirmed") return "success";
  if (o === "soft_yes") return "warning";
  if (o === "rejected") return "danger";
  return "muted";
}

export function RegisterCell({
  isToday,
  readOnly,
  displayEntry,
  myEntry,
  onRequestTick,
  pendingTick,
  onSelectOutcome,
}) {
  if (!isToday) {
    if (!displayEntry?.was_contacted) {
      return <div className="reg-cell reg-cell--empty">—</div>;
    }
    return (
      <div className="reg-cell reg-cell--readonly">
        <Badge variant={outcomeVariant(displayEntry.outcome)}>{outcomeLabel(displayEntry.outcome) || "Logged"}</Badge>
      </div>
    );
  }

  if (readOnly) {
    if (!displayEntry?.was_contacted) {
      return <div className="reg-cell reg-cell--empty">—</div>;
    }
    return (
      <div className="reg-cell reg-cell--readonly">
        <Badge variant={outcomeVariant(displayEntry.outcome)}>{outcomeLabel(displayEntry.outcome) || "Logged"}</Badge>
      </div>
    );
  }

  if (myEntry?.was_contacted) {
    return (
      <div className="reg-cell reg-cell--readonly">
        <Badge variant={outcomeVariant(myEntry.outcome)}>{outcomeLabel(myEntry.outcome)}</Badge>
      </div>
    );
  }

  if (pendingTick) {
    return (
      <div className="reg-cell reg-cell--pending">
        <label className="reg-cell-label mono">Outcome</label>
        <select
          className="reg-cell-select"
          value=""
          onChange={(e) => {
            const v = e.target.value;
            if (v) onSelectOutcome(v);
          }}
        >
          <option value="">Select</option>
          <option value="confirmed">Confirmed</option>
          <option value="soft_yes">Soft Yes</option>
          <option value="no_response">No Response</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    );
  }

  return (
    <div className="reg-cell reg-cell--action">
      <Button variant="secondary" className="reg-cell-btn" type="button" onClick={onRequestTick}>
        <Check size={16} />
        <span>Tick</span>
      </Button>
    </div>
  );
}
