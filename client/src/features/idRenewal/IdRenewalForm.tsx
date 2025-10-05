import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../lib/api";
import { useState } from "react";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().min(1),
  idNumber: z.string().min(5),
  address: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

type Toast = { type: "success" | "error"; message: string } | null;

export default function IdRenewalForm() {
  const { register, handleSubmit, formState, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [toast, setToast] = useState<Toast>(null);

  async function onSubmit(data: FormData) {
    try {
      await api.post("/applications", {
        serviceType: "id-renewal",
        payload: data,
        submit: true,
      });
      reset();
      showToast({
        type: "success",
        message: "Application submitted successfully.",
      });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Something went wrong. Please try again.";
      showToast({ type: "error", message: msg });
    }
  }

  function showToast(t: Exclude<Toast, null>) {
    setToast(t);
    // auto-dismiss after 3 seconds
    window.setTimeout(() => setToast(null), 3000);
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    fontFamily: "system-ui, sans-serif",
    width: "100%",
    maxWidth: "640px",
    margin: "24px auto",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "16px",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "8px",
    color: "#111827",
  };

  const formStyle: React.CSSProperties = {
    display: "grid",
    gap: "12px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    transition: "box-shadow 0.15s ease, border-color 0.15s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    color: "#374151",
    marginBottom: "6px",
    fontWeight: 500,
  };

  const fieldStyle: React.CSSProperties = { display: "grid", gap: "6px" };

  const errorText: React.CSSProperties = {
    color: "#b91c1c",
    fontSize: "12px",
    marginTop: "2px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
    transition: "background-color 0.2s ease, transform 0.1s ease",
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
            left: "50%",
            top: "16px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 14px",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            backgroundColor: toast.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: toast.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${
              toast.type === "success" ? "#a7f3d0" : "#fecaca"
            }`,
            maxWidth: "420px",
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
            style={{
              marginLeft: "auto",
              border: "none",
              background: "transparent",
              color: "inherit",
              fontWeight: 600,
              cursor: "pointer",
              padding: "4px 6px",
              lineHeight: 1,
            }}
            aria-label="Close notification"
            title="Close"
          >
            ×
          </button>
        </div>
      )}

      {/* Form card */}
      <div style={cardStyle}>
        <h1 style={titleStyle}>ID Renewal</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={formStyle}
          aria-describedby="form-errors"
        >
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              placeholder="First name"
              {...register("firstName")}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {formState.errors.firstName && (
              <span style={errorText}>First name is required</span>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="lastName">
              Last name
            </label>
            <input
              id="lastName"
              placeholder="Last name"
              {...register("lastName")}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {formState.errors.lastName && (
              <span style={errorText}>Last name is required</span>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="dateOfBirth">
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              placeholder="YYYY-MM-DD"
              {...register("dateOfBirth")}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {formState.errors.dateOfBirth && (
              <span style={errorText}>Date of birth is required</span>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="idNumber">
              ID number
            </label>
            <input
              id="idNumber"
              placeholder="ID number"
              {...register("idNumber")}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {formState.errors.idNumber && (
              <span style={errorText}>
                ID number must be at least 5 characters
              </span>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="address">
              Address
            </label>
            <input
              id="address"
              placeholder="Address"
              {...register("address")}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {formState.errors.address && (
              <span style={errorText}>
                Address must be at least 5 characters
              </span>
            )}
          </div>

          {formState.errors && Object.keys(formState.errors).length > 0 && (
            <div
              id="form-errors"
              role="alert"
              style={{ ...errorText, marginTop: "4px" }}
            >
              {Object.keys(formState.errors).join(", ")}
            </div>
          )}

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#1d4ed8";
              (e.target as HTMLButtonElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#2563eb";
              (e.target as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            Submit application
          </button>
        </form>
      </div>
    </>
  );
}
