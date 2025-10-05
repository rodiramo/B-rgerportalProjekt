import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein"),
  password: z
    .string()
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Toast = { type: "success" | "error"; message: string } | null;

export default function RegisterPage() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [toast, setToast] = useState<Toast>(null);

  function showToast(t: Exclude<Toast, null>) {
    setToast(t);
    window.setTimeout(() => setToast(null), 2500);
  }

  async function onSubmit(data: FormData) {
    try {
      await api.post("/auth/register", data);
      reset();
      showToast({
        type: "success",
        message: "Registrierung erfolgreich! Du kannst dich jetzt anmelden.",
      });
      setTimeout(() => nav("/login"), 1200);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        "Registrierung fehlgeschlagen. Bitte prüfe deine Angaben und versuche es erneut.";
      showToast({ type: "error", message: msg });
    }
  }

  // ==== inline styles ====
  const page: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f0f4f9 0%, #ffffff 80%)",
    fontFamily: "system-ui, sans-serif",
    padding: 20,
  };

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: "28px 24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  };

  const title: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  };

  const label: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    marginBottom: 4,
  };

  const input: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
    transition: "all 0.15s ease",
  };

  const errorText: React.CSSProperties = {
    color: "#b91c1c",
    fontSize: 12,
    marginTop: 4,
  };

  const button: React.CSSProperties = {
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    transition: "background-color 0.2s, transform 0.1s, opacity 0.2s",
  };

  const footer: React.CSSProperties = {
    marginTop: 14,
    fontSize: 14,
    textAlign: "center",
    color: "#374151",
  };

  const linkStyle: React.CSSProperties = {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 600,
  };

  const focusOn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#2563eb";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.2)";
  };
  const focusOff = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#d1d5db";
    e.currentTarget.style.boxShadow = "none";
  };
  const hoverOn = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isSubmitting) return;
    e.currentTarget.style.backgroundColor = "#1d4ed8";
    e.currentTarget.style.transform = "scale(1.02)";
  };
  const hoverOff = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#2563eb";
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          aria-live="polite"
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            backgroundColor: toast.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: toast.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${
              toast.type === "success" ? "#a7f3d0" : "#fecaca"
            }`,
            maxWidth: 420,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
              display: "inline-block",
            }}
          />
          <span style={{ fontWeight: 500 }}>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            aria-label="Benachrichtigung schließen"
            style={{
              marginLeft: "auto",
              border: "none",
              background: "transparent",
              color: "inherit",
              fontWeight: 700,
              cursor: "pointer",
              padding: "4px 6px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={page}>
        <div style={card}>
          <h1 style={title}>Konto erstellen</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "grid", gap: 12 }}
            noValidate
          >
            <div>
              <label htmlFor="email" style={label}>
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                placeholder="du@beispiel.de"
                {...register("email")}
                style={input}
                onFocus={focusOn}
                onBlur={focusOff}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <div style={errorText}>{errors.email.message}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" style={label}>
                Passwort
              </label>
              <input
                id="password"
                type="password"
                placeholder="Mindestens 8 Zeichen"
                {...register("password")}
                style={input}
                onFocus={focusOn}
                onBlur={focusOff}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <div style={errorText}>{errors.password.message}</div>
              )}
            </div>

            <div>
              <label htmlFor="firstName" style={label}>
                Vorname (optional)
              </label>
              <input
                id="firstName"
                placeholder="Vorname"
                {...register("firstName")}
                style={input}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </div>

            <div>
              <label htmlFor="lastName" style={label}>
                Nachname (optional)
              </label>
              <input
                id="lastName"
                placeholder="Nachname"
                {...register("lastName")}
                style={input}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...button,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              {isSubmitting ? "Wird erstellt…" : "Konto erstellen"}
            </button>
          </form>

          <div style={footer}>
            Du hast bereits ein Konto?{" "}
            <Link to="/login" style={linkStyle}>
              Anmelden
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
