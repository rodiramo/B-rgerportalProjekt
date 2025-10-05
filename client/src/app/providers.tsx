import type { ReactNode } from "react";
import AuthProvider from "../features/auth/AuthProvider.tsx";
import "../i18n";

export default function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
