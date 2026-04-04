export function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function formatDateOnly(isoOrYmd) {
  if (!isoOrYmd) return "—";
  try {
    const d = new Date(isoOrYmd);
    return d.toLocaleDateString("en-KE", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoOrYmd;
  }
}

export function todayYmd() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function passwordStrength(password) {
  if (!password) return { score: 0, label: "None", color: "var(--text3)" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "var(--red)" };
  if (score <= 3) return { score, label: "Fair", color: "var(--yellow)" };
  if (score <= 4) return { score, label: "Good", color: "var(--accent2)" };
  return { score, label: "Strong", color: "var(--green)" };
}

export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
