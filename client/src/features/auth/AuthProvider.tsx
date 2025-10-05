// src/features/auth/AuthProvider.tsx
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthCtx } from "./auth-store.ts";
import api from "../../lib/api.ts";
import type { AuthState } from "./auth-store.ts";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : {};
  });

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    setAuth({ user: res.data.user, accessToken: res.data.accessToken });
  }

  function logout() {
    setAuth({});
  }

  return (
    <AuthCtx.Provider value={{ auth, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
