const DELEGATE_STATUS_LABELS = {
  confirmed: "Confirmed",
  soft_yes: "Soft Yes",
  cold: "Cold",
  lost: "Lost",
};

const OUTCOME_LABELS = {
  confirmed: "Confirmed",
  soft_yes: "Soft Yes",
  no_response: "No Response",
  rejected: "Rejected",
};

export function delegateStatusLabel(key) {
  if (!key) return "";
  return DELEGATE_STATUS_LABELS[key] || key;
}

export function outcomeLabel(key) {
  if (!key) return "";
  return OUTCOME_LABELS[key] || key;
}

export function outcomeOptions() {
  return [
    { value: "confirmed", label: OUTCOME_LABELS.confirmed },
    { value: "soft_yes", label: OUTCOME_LABELS.soft_yes },
    { value: "no_response", label: OUTCOME_LABELS.no_response },
    { value: "rejected", label: OUTCOME_LABELS.rejected },
  ];
}

export function delegateStatusOptions() {
  return [
    { value: "confirmed", label: DELEGATE_STATUS_LABELS.confirmed },
    { value: "soft_yes", label: DELEGATE_STATUS_LABELS.soft_yes },
    { value: "cold", label: DELEGATE_STATUS_LABELS.cold },
    { value: "lost", label: DELEGATE_STATUS_LABELS.lost },
  ];
}
