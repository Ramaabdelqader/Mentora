/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  me as apiMe,
} from "../api/publicApi";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("mentora_user");
    return raw ? JSON.parse(raw) : null;
  });

  // try to hydrate user if we have a token
  useEffect(() => {
    const t = localStorage.getItem("mentora_token");
    if (!t || user) return;
    apiMe()
      .then((u) => {
        setUser(u);
        localStorage.setItem("mentora_user", JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem("mentora_token");
        localStorage.removeItem("mentora_user");
      });
  }, [user]);

  async function login({ email, password }) {
    const { token, user } = await apiLogin({ email, password });
    localStorage.setItem("mentora_token", token);
    localStorage.setItem("mentora_user", JSON.stringify(user));
    setUser(user);
    return user;
  }

  // ✅ provide a working register function
  async function registerFn({ name, email, password }) {
    const { token, user } = await apiRegister({ name, email, password });
    localStorage.setItem("mentora_token", token);
    localStorage.setItem("mentora_user", JSON.stringify(user));
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem("mentora_token");
    localStorage.removeItem("mentora_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register: registerFn, logout }),
    [user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
