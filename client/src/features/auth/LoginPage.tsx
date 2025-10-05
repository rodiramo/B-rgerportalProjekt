import { useState } from "react";
import { useAuthCtx } from "./auth-store.ts";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuthCtx();
  const nav = useNavigate();
  const loc = useLocation() as any;
  const [email, setEmail] = useState("citizen@demo.local");
  const [password, setPassword] = useState("Citizen123!");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      nav(loc.state?.from?.pathname || "/");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  }

  // === Inline Styles ===
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f0f4f9 0%, #ffffff 80%)",
    fontFamily: "system-ui, sans-serif",
    padding: "20px",
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "32px 28px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "20px",
    textAlign: "center",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.15s ease",
  };

  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#2563eb";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.2)";
  };

  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#d1d5db";
    e.currentTarget.style.boxShadow = "none";
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    transition: "background-color 0.2s, transform 0.1s",
  };

  const buttonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#1d4ed8";
    e.currentTarget.style.transform = "scale(1.02)";
  };

  const buttonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#2563eb";
    e.currentTarget.style.transform = "scale(1)";
  };

  const errorText: React.CSSProperties = {
    color: "#b91c1c",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "8px 10px",
    fontSize: "14px",
    marginBottom: "12px",
    textAlign: "center",
  };

  const linkText: React.CSSProperties = {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 600,
  };

  const footerText: React.CSSProperties = {
    marginTop: "16px",
    fontSize: "14px",
    color: "#374151",
    textAlign: "center",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Anmelden</h1>

        {err && (
          <p style={errorText} role="alert">
            {err}
          </p>
        )}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: "12px" }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              E-Mail-Adresse
            </label>
            <input
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Passwort
            </label>
            <input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={buttonHover}
            onMouseLeave={buttonLeave}
          >
            Login
          </button>
        </form>

        <p style={footerText}>
          Kein Konto?{" "}
          <Link to="/register" style={linkText}>
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
