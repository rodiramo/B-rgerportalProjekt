import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

type Citizen = {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

type AppItem = {
  _id: string;
  citizen: string | Citizen; // populated or id
  serviceType: string;
  status: string;
  updatedAt: string;
  payload?: Record<string, any>;
};

type Toast = { type: "success" | "error"; message: string } | null;

export default function ClerkReviewPage() {
  const [items, setItems] = useState<AppItem[]>([]);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  // modal state
  const [modal, setModal] = useState<null | {
    action: "request-info" | "reject";
    appId: string;
    note: string;
    submitting: boolean;
  }>(null);

  const [toast, setToast] = useState<Toast>(null);

  function showToast(t: Exclude<Toast, null>) {
    setToast(t);
    window.setTimeout(() => setToast(null), 2500);
  }

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await api.get("/applications");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function approve(id: string) {
    await api.post(`/applications/${id}/approve`);
    showToast({ type: "success", message: "Application approved." });
    await fetchAll();
  }

  async function submitWithNote(kind: "request-info" | "reject") {
    if (!modal) return;
    setModal({ ...modal, submitting: true });
    try {
      if (kind === "request-info") {
        await api.post(`/applications/${modal.appId}/request-info`, {
          note: modal.note,
        });
        showToast({
          type: "success",
          message: "Requested more info from user.",
        });
      } else {
        await api.post(`/applications/${modal.appId}/reject`, {
          note: modal.note || undefined,
        });
        showToast({ type: "success", message: "Application rejected." });
      }
      setModal(null);
      await fetchAll();
    } catch (e: any) {
      showToast({
        type: "error",
        message: e?.response?.data?.message || "Action failed.",
      });
      setModal({ ...modal, submitting: false });
    }
  }

  const normUser = (c: string | Citizen) => {
    if (typeof c === "string") return { id: c, email: undefined, label: c };
    const name =
      [c.firstName, c.lastName].filter(Boolean).join(" ").trim() ||
      c.email ||
      c._id;
    return { id: c._id, email: c.email, label: name };
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) => {
      const u = normUser(x.citizen);
      return (
        u.id.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        u.label.toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map<
      string,
      { userId: string; email?: string; label: string; apps: AppItem[] }
    >();
    for (const app of filtered) {
      const u = normUser(app.citizen);
      const key = u.id;
      if (!map.has(key))
        map.set(key, {
          userId: u.id,
          email: u.email,
          label: u.label,
          apps: [],
        });
      map.get(key)!.apps.push(app);
    }
    const arr = Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    for (const g of arr) {
      g.apps.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
    return arr;
  }, [filtered]);

  // styles
  const pageStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    padding: 20,
    fontFamily: "system-ui, sans-serif",
    width: "100%",
    margin: "16px 0",
  };
  const titleStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
    color: "#111827",
  };
  const rowStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  };
  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: 14,
  };
  const userHeaderStyle: React.CSSProperties = {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 12px",
    marginTop: 10,
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const userMetaStyle: React.CSSProperties = { fontSize: 14, color: "#374151" };
  const badgeStyle = (status: string): React.CSSProperties => {
    let bg = "#f3f4f6",
      fg = "#374151",
      br = "#e5e7eb";
    if (status === "APPROVED") {
      bg = "#ecfdf5";
      fg = "#065f46";
      br = "#a7f3d0";
    } else if (status === "REJECTED") {
      bg = "#fef2f2";
      fg = "#991b1b";
      br = "#fecaca";
    } else if (status === "SUBMITTED" || status === "RESUBMITTED") {
      bg = "#eff6ff";
      fg = "#1e3a8a";
      br = "#bfdbfe";
    } else if (status === "IN_REVIEW" || status === "NEEDS_INFO") {
      bg = "#fff7ed";
      fg = "#9a3412";
      br = "#fed7aa";
    }
    return {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 999,
      background: bg,
      color: fg,
      border: `1px solid ${br}`,
      fontSize: 12,
      fontWeight: 600,
    };
  };
  const btnPrimary: React.CSSProperties = {
    padding: "8px 12px",
    border: "none",
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  };
  const btnGhost: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#374151",
    cursor: "pointer",
    fontSize: 13,
  };
  const dangerBtn: React.CSSProperties = {
    ...btnGhost,
    borderColor: "#fecaca",
    color: "#991b1b",
    background: "#fff5f5",
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
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Modal */}
      {modal && (
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
          onClick={() => !modal.submitting && setModal(null)}
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
              {modal.action === "request-info"
                ? "Request more information"
                : "Reject application"}
            </h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>
              {modal.action === "request-info"
                ? "Write a short note explaining what information is missing."
                : "Optionally include a short reason for rejection."}
            </p>
            <textarea
              value={modal.note}
              onChange={(e) => setModal({ ...modal, note: e.target.value })}
              placeholder={
                modal.action === "request-info"
                  ? "Example: Please upload a clear proof of address…"
                  : "Example: Document invalid / information inconsistent…"
              }
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
                style={btnGhost}
                onClick={() => !modal.submitting && setModal(null)}
              >
                Cancel
              </button>
              {modal.action === "request-info" ? (
                <button
                  style={btnPrimary}
                  disabled={modal.submitting || modal.note.trim().length === 0}
                  onClick={() => submitWithNote("request-info")}
                >
                  {modal.submitting ? "Sending…" : "Send request"}
                </button>
              ) : (
                <button
                  style={dangerBtn}
                  disabled={modal.submitting}
                  onClick={() => submitWithNote("reject")}
                >
                  {modal.submitting ? "Rejecting…" : "Reject"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page */}
      <div style={pageStyle}>
        <h1 style={titleStyle}>Review Queue</h1>

        {/* Search */}
        <div style={rowStyle}>
          <input
            placeholder="Search by user email, name, or ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={fetchAll}
            style={btnGhost}
            title="Refresh"
            aria-label="Refresh list"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Loading / Empty */}
        {loading && <p style={{ color: "#6b7280", fontSize: 14 }}>Loading…</p>}
        {!loading && grouped.length === 0 && (
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            No applications found{query ? " for this search." : "."}
          </p>
        )}

        {/* Groups */}
        {grouped.map((g) => (
          <section key={g.userId}>
            <div style={userHeaderStyle}>
              <div>
                <div style={{ fontWeight: 700, color: "#111827" }}>
                  {g.label}
                </div>
                <div style={userMetaStyle}>
                  {g.email ? g.email + " • " : ""}User ID: {g.userId} •{" "}
                  {g.apps.length} application{g.apps.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {g.apps.map((x) => {
              const isOpen = !!expanded[x._id];
              return (
                <div
                  key={x._id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 8,
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <strong>ID:</strong> {x._id.slice(-8)}
                      </div>
                      <div>
                        <strong>Service:</strong> {x.serviceType}
                      </div>
                      <div>
                        <span style={badgeStyle(x.status)}>{x.status}</span>
                      </div>
                      <div style={{ color: "#6b7280" }}>
                        {new Date(x.updatedAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={btnGhost}
                        onClick={() =>
                          setExpanded((s) => ({ ...s, [x._id]: !s[x._id] }))
                        }
                      >
                        {isOpen ? "Hide details" : "View details"}
                      </button>
                      <button style={btnPrimary} onClick={() => approve(x._id)}>
                        Approve
                      </button>
                      <button
                        style={btnGhost}
                        onClick={() =>
                          setModal({
                            action: "request-info",
                            appId: x._id,
                            note: "",
                            submitting: false,
                          })
                        }
                      >
                        Request info
                      </button>
                      <button
                        style={dangerBtn}
                        onClick={() =>
                          setModal({
                            action: "reject",
                            appId: x._id,
                            note: "",
                            submitting: false,
                          })
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div
                      style={{
                        marginTop: 10,
                        paddingTop: 10,
                        borderTop: "1px dashed #e5e7eb",
                        fontSize: 14,
                        color: "#111827",
                      }}
                    >
                      <div style={{ marginBottom: 6, fontWeight: 600 }}>
                        Application Data
                      </div>
                      {x.payload ? (
                        <pre
                          style={{
                            margin: 0,
                            padding: 12,
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            overflowX: "auto",
                          }}
                        >
                          {JSON.stringify(x.payload, null, 2)}
                        </pre>
                      ) : (
                        <div style={{ color: "#6b7280" }}>
                          No payload attached.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </>
  );
}
