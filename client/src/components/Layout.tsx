import { Link, Outlet } from "react-router-dom";
import { useAuthCtx } from "../features/auth/auth-store";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState } from "react";

export default function Layout() {
  const { auth, logout } = useAuthCtx();
  const [hovered, setHovered] = useState<string | null>(null);

  const linkStyle = (name: string): React.CSSProperties => ({
    textDecoration: "none",
    color: hovered === name ? "#2563eb" : "#374151",
    fontWeight: 500,
    transition: "color 0.2s ease",
  });

  const buttonStyle: React.CSSProperties = {
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s ease, transform 0.1s ease",
  };

  const headerLink = (to: string, label: string) => (
    <Link
      to={to}
      onMouseEnter={() => setHovered(label)}
      onMouseLeave={() => setHovered(null)}
      style={linkStyle(label)}
    >
      {label}
    </Link>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "#111827",
              textDecoration: "none",
            }}
          >
            Bürgerportal
          </Link>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              fontSize: "0.95rem",
            }}
          >
            {headerLink("/apply/id-renewal", "ID-Erneuerung")}
            {auth.user?.role === "citizen" &&
              headerLink("/applications", "Meine Anträge")}
            {(auth.user?.role === "clerk" || auth.user?.role === "admin") &&
              headerLink("/review", "Review")}

            <LanguageSwitcher />

            {auth.user ? (
              <button
                onClick={logout}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "#1d4ed8";
                  (e.target as HTMLButtonElement).style.transform =
                    "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "#2563eb";
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Logout
              </button>
            ) : (
              <div style={{ display: "flex", gap: "14px" }}>
                {headerLink("/login", "Login")}
                {headerLink("/register", "Register")}
              </div>
            )}
          </nav>
        </div>
      </header>

      <main
        style={{
          width: "100%",
        }}
      >
        <Outlet />
      </main>

      <footer
        style={{
          backgroundColor: "#fff",
          borderTop: "1px solid #e5e7eb",
          padding: "12px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "0.85rem",
          marginTop: "auto",
        }}
      >
        © {new Date().getFullYear()} Bürgerportal — All rights reserved.
      </footer>
    </div>
  );
}
