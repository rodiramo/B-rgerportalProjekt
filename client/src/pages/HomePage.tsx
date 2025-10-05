import { Link } from "react-router-dom";
import { useAuthCtx } from "../features/auth/auth-store";

export default function HomePage() {
  const { auth } = useAuthCtx();
  const role = auth.user?.role; // 'citizen' | 'clerk' | 'admin' | undefined

  const page: React.CSSProperties = {
    fontFamily: "system-ui, sans-serif",
    color: "#111827",
    padding: "24px 20px",
  };

  const hero: React.CSSProperties = {
    background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%)",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: "28px",
    marginBottom: 20,
    display: "grid",
    gap: 8,
  };

  const heroTitle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.2,
  };

  const heroText: React.CSSProperties = {
    margin: 0,
    color: "#374151",
    fontSize: 15,
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    alignItems: "stretch",
  };

  const card: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
    display: "grid",
    alignContent: "start",
    gap: 8,
  };

  const cardHeader: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  };

  const badge: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    background: "#eef2ff",
    color: "#3730a3",
    border: "1px solid #c7d2fe",
    fontSize: 12,
    fontWeight: 700,
  };

  const small: React.CSSProperties = {
    color: "#6b7280",
    fontSize: 14,
    margin: 0,
  };

  const ctaRow: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 8,
  };

  const buttonPrimary: React.CSSProperties = {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    border: "1px solid #1d4ed8",
  };

  const buttonGhost: React.CSSProperties = {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: 10,
    background: "#fff",
    color: "#374151",
    textDecoration: "none",
    fontWeight: 600,
    border: "1px solid #e5e7eb",
  };

  const list: React.CSSProperties = {
    margin: 0,
    paddingLeft: 18,
    color: "#374151",
    fontSize: 14,
    lineHeight: 1.5,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
  };

  // Reusable “service card” (title, text, actions)
  function ServiceCard({
    title,
    tag,
    text,
    primary,
    toPrimary,
    secondary,
    toSecondary,
    extra,
  }: {
    title: string;
    tag?: string;
    text: string;
    primary?: string;
    toPrimary?: string;
    secondary?: string;
    toSecondary?: string;
    extra?: React.ReactNode;
  }) {
    return (
      <div style={card}>
        <div style={cardHeader}>
          <h3 style={sectionTitle}>{title}</h3>
          {tag ? <span style={badge}>{tag}</span> : null}
        </div>
        <p style={small}>{text}</p>
        {extra}
        <div style={ctaRow}>
          {primary && toPrimary && (
            <Link to={toPrimary} style={buttonPrimary}>
              {primary}
            </Link>
          )}
          {secondary && toSecondary && (
            <Link to={toSecondary} style={buttonGhost}>
              {secondary}
            </Link>
          )}
        </div>
      </div>
    );
  }

  // CONTENT BY ROLE
  const isCitizen = role === "citizen";
  const isStaff = role === "clerk" || role === "admin";

  return (
    <div style={page}>
      {/* Hero */}
      <section style={hero} aria-labelledby="hero-title">
        <h1 id="hero-title" style={heroTitle}>
          Bürgerportal
        </h1>
        <p style={heroText}>
          Digitale Dienstleistungen Ihrer Stadtverwaltung – sicher, schnell und
          transparent.
        </p>
        {isCitizen && (
          <p style={{ ...heroText, fontWeight: 600 }}>
            Willkommen zurück{auth.user?.email ? `, ${auth.user.email}` : ""}!
            Sie können neue Anträge stellen und den Status verfolgen.
          </p>
        )}
        {isStaff && (
          <p style={{ ...heroText, fontWeight: 600 }}>
            Mitarbeitendenbereich: Prüfen, kommentieren und entscheiden Sie über
            eingereichte Anträge.
          </p>
        )}
        {!role && (
          <p style={{ ...heroText, fontWeight: 600 }}>
            Melden Sie sich an, um Anträge zu stellen oder Anträge zu prüfen.
          </p>
        )}
      </section>

      {/* Grid of cards */}
      <section style={grid} aria-label="Available actions and information">
        {/* Citizen-facing services */}
        {(!role || isCitizen) && (
          <>
            <ServiceCard
              title="Personalausweis erneuern"
              tag="Online-Service"
              text="Beantragen Sie die Erneuerung Ihres Ausweises vollständig online und laden Sie erforderliche Nachweise hoch."
              primary="Antrag starten"
              toPrimary="/apply/id-renewal"
              secondary="Meine Anträge"
              toSecondary="/applications"
              extra={
                <ul style={list}>
                  <li>Bearbeitungsfortschritt in Echtzeit einsehbar</li>
                  <li>Benachrichtigungen bei Rückfragen</li>
                  <li>Sichere Datenübermittlung</li>
                </ul>
              }
            />

            <ServiceCard
              title="Meine Anträge"
              text="Status einsehen, zusätzliche Informationen nachreichen oder Unterlagen aktualisieren."
              primary="Zum Antragsüberblick"
              toPrimary="/applications"
            />
          </>
        )}

        {/* Staff / Clerk tools */}
        {isStaff && (
          <>
            <ServiceCard
              title="Eingang & Prüfung"
              tag={role === "admin" ? "Verwaltung" : "Sachbearbeitung"}
              text="Sichten Sie neue Anträge, fordern Sie Informationen an oder treffen Sie Entscheidungen."
              primary="Review-Queue öffnen"
              toPrimary="/review"
              extra={
                <ul style={list}>
                  <li>Anträge nach Bürger:in gruppiert</li>
                  <li>Schnellsuche nach E-Mail / Nutzer-ID</li>
                  <li>Aktionen: Genehmigen, Rückfrage, Ablehnen</li>
                </ul>
              }
            />

            <ServiceCard
              title="Suche"
              text="Suchen Sie gezielt nach Anträgen von Bürger:innen (E-Mail, Name oder ID)."
              primary="Zur Review-Suche"
              toPrimary="/review"
            />
          </>
        )}

        {/* General info / Help */}
      </section>

      {/* Optional: announcements */}
      <section
        aria-label="Announcements"
        style={{
          marginTop: 20,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          background: "#fff",
        }}
      >
        <h3 style={sectionTitle}>Aktuelle Hinweise</h3>
        <ul style={list}>
          <li>Geplante Wartung am kommenden Sonntag 02:00–04:00 Uhr.</li>
          <li>Bitte prüfen Sie die Lesbarkeit hochgeladener Dokumente.</li>
        </ul>
      </section>
    </div>
  );
}
