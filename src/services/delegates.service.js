import { api } from "./api.js";

function unwrap(res) {
  const b = res.data;
  if (!b?.success) throw new Error(b?.message || "Request failed");
  return b.data;
}

export async function fetchDelegates(params = {}) {
  const res = await api.get("/delegates", { params });
  return unwrap(res);
}

export async function fetchDelegateById(id) {
  const res = await api.get(`/delegates/${id}`);
  return unwrap(res);
}

export async function createDelegate(payload) {
  const res = await api.post("/delegates", payload);
  return unwrap(res);
}

export async function patchDelegate(id, payload) {
  const res = await api.patch(`/delegates/${id}`, payload);
  return unwrap(res);
}

export async function updateDelegateStatus(id, newStatus, notes) {
  const res = await api.patch(`/delegates/${id}/status`, { new_status: newStatus, notes });
  return unwrap(res);
}

export async function assignDelegate(delegateId, teamMemberId) {
  const res = await api.post(`/delegates/${delegateId}/assign`, { team_member_id: teamMemberId });
  return unwrap(res);
}

export async function unassignDelegate(delegateId, teamMemberId) {
  const res = await api.delete(`/delegates/${delegateId}/assign/${teamMemberId}`);
  return unwrap(res);
}

export async function importDelegates(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/delegates/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}

export async function exportDelegates(format = "csv") {
  const res = await api.get("/delegates/export", {
    params: { format },
    responseType: "blob",
  });
  const ext = format === "xlsx" ? "xlsx" : "csv";
  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `delegates.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadDelegateTemplate() {
  const res = await api.get("/delegates/template", { responseType: "blob" });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "delegates_template.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}

export async function fetchSchools(collegeId = null) {
  const params = collegeId ? { college_id: collegeId } : {};
  const res = await api.get("/schools", { params });
  return unwrap(res);
}

export async function fetchDepartments(schoolId = null) {
  const params = schoolId ? { school_id: schoolId } : {};
  const res = await api.get("/departments", { params });
  return unwrap(res);
}