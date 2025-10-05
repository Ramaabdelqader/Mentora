/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin } from "../api/cmsApi";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("mentora_cms_token") || ""
  );
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mentora_cms_user") || "null");
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!token;

  // STAFF-ONLY login (admin/instructor). Throws for students.
  async function login({ email, password }) {
    if (!email || !password) throw new Error("Email & password required");

    // Expects: { token, user: { id, name, email, role } }
    const data = await apiLogin({ email, password });

    if (!["admin", "instructor"].includes(data.user?.role)) {
      // Do NOT persist anything if not staff
      throw new Error("Forbidden: CMS is for staff only");
    }

    localStorage.setItem("mentora_cms_token", data.token);
    localStorage.setItem("mentora_cms_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("mentora_cms_token");
    localStorage.removeItem("mentora_cms_user");
    setToken("");
    setUser(null);
  }

  // Keep multiple tabs/windows in sync
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "mentora_cms_token") setToken(e.newValue || "");
      if (e.key === "mentora_cms_user")
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ token, user, isAuthenticated, login, logout }),
    [token, user, isAuthenticated]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
