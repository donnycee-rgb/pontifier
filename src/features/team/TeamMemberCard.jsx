import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import "./TeamMemberCard.css";

export function TeamMemberCard({ member, currentUserId, onDeactivate, onActivate }) {
  const isSelf = member.id === currentUserId;
  const collegeLabel = member.college_code || member.college_name || member.college;

  return (
    <article className="team-card card">
      <div className="team-card-header">
        <div>
          <h3 className="team-card-name">{member.name}</h3>
          <p className="team-card-email mono">{member.email}</p>
        </div>
        <Badge variant={member.is_active ? "success" : "danger"}>{member.is_active ? "Active" : "Inactive"}</Badge>
      </div>
      <div className="team-card-meta">
        <Badge variant="accent">{String(member.role).replace("_", " ")}</Badge>
        {collegeLabel ? <span className="mono team-card-college">{collegeLabel}</span> : null}
      </div>
      <dl className="team-card-stats">
        <div>
          <dt className="mono">Assigned delegates</dt>
          <dd>{member.assigned_delegates_count ?? "—"}</dd>
        </div>
        <div>
          <dt className="mono">Contacts today</dt>
          <dd>{member.delegates_contacted_today ?? 0}</dd>
        </div>
        <div>
          <dt className="mono">This week</dt>
          <dd>{member.delegates_contacted_this_week ?? 0}</dd>
        </div>
      </dl>
      {member.is_active && !isSelf ? (
        <Button variant="danger" type="button" className="team-card-deactivate" onClick={() => onDeactivate(member.id)}>
          Deactivate account
        </Button>
      ) : null}
      {!member.is_active ? (
        <Button type="button" className="team-card-deactivate" onClick={() => onActivate(member.id)}>
          Activate account
        </Button>
      ) : null}
    </article>
  );
}
