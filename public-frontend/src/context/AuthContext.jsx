/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("mentora_user");
    return raw ? JSON.parse(raw) : null;
  });

  async function login({ email, password }) {
    // 👉 fix: actually use password now (mock auth for now)
    if (!email || !password) throw new Error("Email and password required");

    // fake login response
    const fake = {
      id: 1,
      name: email.split("@")[0],
      email,
      role: email.includes("admin") ? "admin" : "student",
    };

    // store "token" & user
    localStorage.setItem("mentora_token", "FAKE.JWT.TOKEN");
    localStorage.setItem("mentora_user", JSON.stringify(fake));
    setUser(fake);
    return fake;
  }

  function logout() {
    localStorage.removeItem("mentora_token");
    localStorage.removeItem("mentora_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user]
  );

  // sync between browser tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "mentora_user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
