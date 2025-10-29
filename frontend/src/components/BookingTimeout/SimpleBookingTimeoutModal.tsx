import React from "react";

type Props = {
  open: boolean;
  onReload: () => void;
};

export default function SimpleBookingTimeoutModal({ open, onReload }: Props) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Sessionen gick ut"
    >
      <div
        style={{
          width: "min(92vw, 420px)",
          borderRadius: 14,
          padding: "18px 16px",
          background: "#1b1b2f",
          color: "#fff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
        }}
      >
        <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem" }}>Sessionen gick ut</h2>
        <p style={{ margin: "6px 0", lineHeight: 1.4 }}>
          Du har väntat mer än 10 minuter. För att visa korrekta platser och priser
          behöver sidan uppdateras.
        </p>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="nav-button" onClick={onReload} style={{ minWidth: 140 }}>
            Uppdatera sidan
          </button>
        </div>
      </div>
    </div>
  );
}