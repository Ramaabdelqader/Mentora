/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("mentora_cms_user");
    return raw ? JSON.parse(raw) : null;
  });

  async function login({ email, password }) {
    if (!email || !password) throw new Error("Email & password required");
    const role = email.includes("admin") ? "admin" : "instructor"; // ✅ CMS only
    const fake = { id: 1, name: email.split("@")[0], email, role };

    localStorage.setItem("mentora_cms_token", "FAKE.CMS.TOKEN");
    localStorage.setItem("mentora_cms_user", JSON.stringify(fake));
    setUser(fake);
    return fake;
  }

  function logout() {
    localStorage.removeItem("mentora_cms_token");
    localStorage.removeItem("mentora_cms_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user }),
    [user]
  );

  useEffect(() => {
    const sync = (e) => {
      if (e.key === "mentora_cms_user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
