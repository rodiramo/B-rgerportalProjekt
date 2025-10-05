// src/components/Protected.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthCtx } from "../features/auth/auth-store";
import type { Role } from "../features/auth/auth-store";
import type { ReactNode } from "react";

export default function Protected({
  roles,
  children,
}: {
  roles?: Role[];
  children: ReactNode;
}) {
  const { auth } = useAuthCtx();
  const loc = useLocation();

  if (!auth.user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (roles && !roles.includes(auth.user.role))
    return <Navigate to="/" replace />;

  return <>{children}</>;
}
