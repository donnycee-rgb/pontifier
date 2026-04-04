import axios from "axios";

const TOKEN_KEY = "campaign_hq_token";
const REFRESH_KEY = "campaign_hq_refresh";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function setRefreshToken(token) {
  if (token) {
    localStorage.setItem(REFRESH_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_KEY);
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || "";

    if (
      status === 401 &&
      !originalRequest._retry &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      const refresh = getRefreshToken();
      if (!refresh) {
        clearAuthStorage();
        if (typeof window !== "undefined") {
          window.location.assign("/login");
        }
        return Promise.reject(error);
      }

      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/auth/refresh`, { refreshToken: refresh })
          .then((res) => {
            const body = res.data;
            if (!body?.success || !body.data) {
              throw new Error(body?.message || "Refresh failed");
            }
            const { accessToken, refreshToken: newRefresh } = body.data;
            setAuthToken(accessToken);
            if (newRefresh) {
              setRefreshToken(newRefresh);
            }
            return accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const accessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        clearAuthStorage();
        if (typeof window !== "undefined") {
          window.location.assign("/login");
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
