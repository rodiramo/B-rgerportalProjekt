// src/features/auth/auth-store.ts
import { createContext, useContext } from "react";

export type Role = "citizen" | "clerk" | "admin";

export interface User {
  _id: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user?: User;
  accessToken?: string;
}

export const AuthCtx = createContext<{
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}>({ auth: {}, login: async () => {}, logout: () => {} });

export function useAuthCtx() {
  return useContext(AuthCtx);
}
