import { api, clearAuthStorage, setAuthToken, setRefreshToken, getRefreshToken } from "./api.js";

function unwrap(res) {
  const b = res.data;
  if (!b?.success) {
    throw new Error(b?.message || "Request failed");
  }
  return b.data;
}

export async function loginRequest(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return unwrap(res);
}

export async function changePasswordRequest(currentPassword, newPassword, confirmNewPassword) {
  const res = await api.post("/auth/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
    confirm_new_password: confirmNewPassword,
  });
  return unwrap(res);
}

export async function fetchMe() {
  const res = await api.get("/auth/me");
  return unwrap(res);
}

export async function logoutRequest() {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch {
      /* still clear local session */
    }
  }
  clearAuthStorage();
}

export function persistSession(accessToken, refreshToken) {
  setAuthToken(accessToken);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
}
