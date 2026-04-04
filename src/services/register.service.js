import { api } from "./api.js";

function unwrap(res) {
  const b = res.data;
  if (!b?.success) throw new Error(b?.message || "Request failed");
  return b.data;
}

export async function fetchRegister(params = {}) {
  const res = await api.get("/register", { params });
  return unwrap(res);
}

export async function postRegisterEntry(payload) {
  const res = await api.post("/register", {
    delegate_id: payload.delegate_id,
    contact_date: payload.contact_date,
    was_contacted: payload.was_contacted,
    outcome: payload.outcome ?? null,
    notes: payload.notes ?? null,
  });
  return unwrap(res);
}
