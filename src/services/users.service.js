import { api } from "./api.js";

function unwrap(res) {
  const b = res.data;
  if (!b?.success) throw new Error(b?.message || "Request failed");
  return b.data;
}

export async function fetchUsers(params = {}) {
  const res = await api.get("/users", { params });
  return unwrap(res);
}

export async function createUser(payload) {
  const res = await api.post("/users", payload);
  return unwrap(res);
}

export async function deactivateUser(id) {
  const res = await api.patch(`/users/${id}/deactivate`);
  return unwrap(res);
}

export async function activateUser(id) {
  const res = await api.patch(`/users/${id}/activate`);
  return unwrap(res);
}

export async function fetchUserById(id) {
  const res = await api.get(`/users/${id}`);
  return unwrap(res);
}
export async function deleteUser(id) {
  const res = await api.delete(`/users/${id}`);
  return unwrap(res);
}