import { api } from "./api.js";

function unwrap(res) {
  const b = res.data;
  if (!b?.success) throw new Error(b?.message || "Request failed");
  return b.data;
}

export async function fetchColleges() {
  const res = await api.get("/colleges");
  return unwrap(res);
}
