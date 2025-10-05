import { useAuthCtx } from "./auth-store";
/**
 * Small helper hook for cleaner imports.
 * Instead of: const { auth, login, logout } = useAuthCtx();
 * you can just do: const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const { auth, login, logout } = useAuthCtx();

  const user = auth.user;
  const accessToken = auth.accessToken;
  const isLoggedIn = !!user;

  return { user, accessToken, isLoggedIn, login, logout };
}
export type { Role } from "./auth-store"; // ✅ type-only import
