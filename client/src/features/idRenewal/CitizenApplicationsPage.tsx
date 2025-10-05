import { useEffect, useState } from "react";
import api from "../../lib/api";

type HistoryItem = {
  action: string;
  note?: string;
  at?: string;
};

type AppItem = {
  _id: string;
  serviceType: string;
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "IN_REVIEW"
    | "NEEDS_INFO"
    | "RESUBMITTED"
    | "APPROVED"
    | "ISSUED"
    | "REJECTED";
  updatedAt: string;
  history?: HistoryItem[];
};

type Toast = { type: "success" | "error"; message: string } | null;

export default function CitizenApplicationsPage() {
  const [items, setItems] = useState<AppItem[]>([]);
  const [toast, setToast] = useState<Toast>(null);

  const [reasonForId, setReasonForId] = useState<string | null>(null);
  const [resubmit, setResubmit] = useState<{
    id: string;
    note: string;
    submitting: boolean;
  } | null>(null);

  function showToast(t: Exclude<Toast, null>) {
    setToast(t);
    window.setTimeout(() => setToast(null), 2500);
  }

  async function fetchAll() {
    const res = await api.get("/applications");
    setItems(res.data);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  function lastClerkNote(app: AppItem): string | undefined {
    if (!app.history || app.history.length === 0) return;
    for (let i = app.history.length - 1; i >= 0; i--) {
      const h = app.history[i];
      if ((h.action === "REQUEST_INFO" || h.action === "REJECTED") && h.note) {
        return h.note;
      }
    }
    return;
  }

  async function submitResubmit() {
    if (!resubmit) return;
    try {
      await api.post(`/applications/${resubmit.id}/resubmit`, {
        note: resubmit.note,
      });
      showToast({
        type: "success",
        message: "Antrag wurde erneut eingereicht.",
      });
      setResubmit(null);
      await fetchAll();
    } catch (e: any) {
      showToast({
        type: "error",
        message:
          e?.response?.data?.message || "Fehler beim erneuten Einreichen.",
      });
      setResubmit((s) => (s ? { ...s, submitting: false } : s));
    }
  }

  const cardStyle: React.CSSProperties = {
    color: "#333",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    fontFamily: "system-ui, sans-serif",
    maxWidth: "900px",
    margin: "40px auto",
    background: "#fff",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "16px",
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: "8px",
  };

  const actionBtn: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#374151",
    cursor: "pointer",
    fontSize: 13,
    marginRight: 8,
  };

  const primaryBtn: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  };

  const statusPill = (status: AppItem["status"]): React.CSSProperties => {
    let bg = "#f3f4f6",
      fg = "#374151",
      br = "#e5e7eb";
    if (status === "APPROVED") {
      bg = "#d1fae5";
      fg = "#065f46";
      br = "#a7f3d0";
    } else if (status === "REJECTED") {
      bg = "#fee2e2";
      fg = "#991b1b";
      br = "#fecaca";
    } else if (status === "SUBMITTED" || status === "RESUBMITTED") {
      bg = "#e0f2fe";
      fg = "#1e3a8a";
      br = "#bfdbfe";
    } else if (status === "NEEDS_INFO") {
      bg = "#fff7ed";
      fg = "#9a3412";
      br = "#fed7aa";
    }
    return {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: 8,
      background: bg,
      color: fg,
      border: `1px solid ${br}`,
      fontWeight: 500,
    };
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
            aria-label="Benachrichtigung schließen"
          >
            ×
          </button>
        </div>
      )}

      {/* Grund-Modal */}
      {reasonForId && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "grid",
            placeItems: "center",
            zIndex: 999,
          }}
          onClick={() => setReasonForId(null)}
        >
          <div
            style={{
              width: "min(560px, 92vw)",
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 18,
                color: "#111827",
              }}
            >
              Rückmeldung der Behörde
            </h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>
              Dies ist die letzte Rückmeldung zum Antrag.
            </p>
            <div
              style={{
                marginTop: 12,
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 12,
                whiteSpace: "pre-wrap",
              }}
            >
              {(items.find((i) => i._id === reasonForId) &&
                lastClerkNote(items.find((i) => i._id === reasonForId)!)) ||
                "Keine Anmerkung vorhanden."}
            </div>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button style={actionBtn} onClick={() => setReasonForId(null)}>
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Erneut einreichen */}
      {resubmit && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "grid",
            placeItems: "center",
            zIndex: 999,
          }}
          onClick={() => !resubmit.submitting && setResubmit(null)}
        >
          <div
            style={{
              width: "min(560px, 92vw)",
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 18,
                color: "#111827",
              }}
            >
              Informationen hinzufügen & erneut einreichen
            </h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>
              Fügen Sie eine kurze Nachricht hinzu, was Sie geändert oder
              ergänzt haben.
            </p>
            <textarea
              value={resubmit.note}
              onChange={(e) =>
                setResubmit({ ...resubmit, note: e.target.value })
              }
              placeholder="Beispiel: Ich habe meine Adresse aktualisiert und das korrekte Dokument hochgeladen…"
              style={{
                width: "100%",
                minHeight: 120,
                marginTop: 12,
                padding: 10,
                borderRadius: 10,
                border: "1px solid #d1d5db",
                outline: "none",
                fontSize: 14,
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <button
                style={actionBtn}
                onClick={() => !resubmit.submitting && setResubmit(null)}
              >
                Abbrechen
              </button>
              <button
                style={primaryBtn}
                onClick={() => {
                  if (!resubmit.note.trim()) return;
                  setResubmit({ ...resubmit, submitting: true });
                  submitResubmit();
                }}
                disabled={resubmit.submitting || !resubmit.note.trim()}
              >
                {resubmit.submitting ? "Wird gesendet…" : "Erneut einreichen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hauptkarte */}
      <div style={cardStyle}>
        <h1 style={titleStyle}>Meine Anträge</h1>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "15px",
          }}
        >
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                ID
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Dienstleistung
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Status
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Aktualisiert
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr
                key={x._id}
                style={{
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #eee",
                }}
              >
                <td style={{ padding: "8px" }}>{x._id.slice(-6)}</td>
                <td style={{ padding: "8px" }}>{x.serviceType}</td>
                <td style={{ padding: "8px" }}>
                  <span style={statusPill(x.status)}>{x.status}</span>
                </td>
                <td style={{ padding: "8px", color: "#555" }}>
                  {new Date(x.updatedAt).toLocaleString("de-DE")}
                </td>
                <td style={{ padding: "8px" }}>
                  {(x.status === "NEEDS_INFO" || x.status === "REJECTED") && (
                    <>
                      <button
                        style={actionBtn}
                        onClick={() => setReasonForId(x._id)}
                      >
                        Grund ansehen
                      </button>
                      {x.status === "NEEDS_INFO" && (
                        <button
                          style={primaryBtn}
                          onClick={() =>
                            setResubmit({
                              id: x._id,
                              note: "",
                              submitting: false,
                            })
                          }
                        >
                          Ergänzen & erneut einreichen
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
