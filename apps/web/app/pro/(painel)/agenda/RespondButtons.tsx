"use client";

import { useState } from "react";
import { respondAppointment } from "@/lib/pro/actions";

export function RespondButtons({ appointmentId }: { appointmentId: string }) {
  const [state, setState] = useState<"idle" | "confirmed" | "declined">("idle");

  if (state !== "idle") {
    return (
      <span style={{ fontSize: 12.5, fontWeight: 600, color: state === "confirmed" ? "#2f9e6b" : "var(--color-text-muted)" }}>
        {state === "confirmed" ? "confirmada ✓" : "recusada"}
      </span>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        onClick={() => {
          setState("confirmed");
          respondAppointment({ appointmentId, status: "confirmed" });
        }}
        style={{ height: 34, padding: "0 16px", borderRadius: "var(--radius-pill)", border: "none", background: "var(--color-orange)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
      >
        confirmar
      </button>
      <button
        onClick={() => {
          setState("declined");
          respondAppointment({ appointmentId, status: "declined" });
        }}
        style={{ height: 34, padding: "0 16px", borderRadius: "var(--radius-pill)", border: "1px solid var(--color-border-strong)", background: "var(--color-surface-elevated)", color: "var(--color-text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
      >
        recusar
      </button>
    </div>
  );
}
