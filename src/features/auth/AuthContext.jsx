import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import { getStoredToken, clearAuthStorage, setAuthToken, setRefreshToken } from "../../services/api.js";
import { loginRequest, fetchMe, logoutRequest, persistSession } from "../../services/auth.service.js";

const AuthContext = createContext(null);

function mapUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    college_id: u.college_id,
    college_code: u.college_code,
    college_name: u.college_name,
    is_first_login: Boolean(u.is_first_login),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  const bootstrap = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setReady(true);
      return;
    }
    try {
      const data = await fetchMe();
      setToken(t);
      setUser(mapUser(data.user));
    } catch {
      clearAuthStorage();
      setToken(null);
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    persistSession(data.accessToken, data.refreshToken);
    setToken(data.accessToken);
    const u = mapUser(data.user);
    setUser(u);
    return {
      user: u,
      requiresPasswordChange: Boolean(data.requiresPasswordChange),
    };
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...patch };
    });
  }, []);

  const setSessionFromAuthPayload = useCallback((data) => {
    persistSession(data.accessToken, data.refreshToken);
    setToken(data.accessToken);
    setUser(mapUser(data.user));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      login,
      logout,
      updateUser,
      setSessionFromAuthPayload,
      isAuthenticated: Boolean(user && token),
      refreshSession: bootstrap,
    }),
    [user, token, ready, login, logout, updateUser, setSessionFromAuthPayload, bootstrap]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
