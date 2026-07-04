"use client";

import { useState } from "react";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions";
import { relativeLabel } from "@/lib/dates";
import { PRO_ACCENT, type AppNotification, type Professional } from "@/lib/types";

const NICON: Record<string, string> = {
  protocolo: "M8 6h10M8 12h10M8 18h7M4 6h.01M4 12h.01M4 18h.01",
  mensagem: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  resultado: "M3 3v18h18M7 15l3-3 3 3 4-5",
  consulta:
    "M8 2v4M16 2v4M3.5 9.5h17M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
};

type Notif = AppNotification & {
  professional: Pick<Professional, "id" | "type" | "name" | "short_name"> | null;
};

export function NotificacoesClient({ notifications }: { notifications: Notif[] }) {
  const [filter, setFilter] = useState<"todas" | "nutri" | "personal">("todas");
  const [read, setRead] = useState<Set<string>>(
    () => new Set(notifications.filter((n) => n.read_at).map((n) => n.id)),
  );

  const filtered = notifications.filter(
    (n) => filter === "todas" || n.professional?.type === filter,
  );
  const unreadCount = notifications.filter((n) => !read.has(n.id)).length;

  const seg = (f: typeof filter, label: string) => (
    <button
      key={f}
      onClick={() => setFilter(f)}
      style={{
        height: 30,
        padding: "0 14px",
        borderRadius: "var(--radius-pill)",
        border: filter === f ? "none" : "1px solid var(--color-border-strong)",
        background: filter === f ? "var(--color-orange)" : "var(--color-surface-elevated)",
        color: filter === f ? "#fff" : "var(--color-text-secondary)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {seg("todas", "todas")}
          {seg("nutri", "nutri")}
          {seg("personal", "personal")}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => {
              setRead(new Set(notifications.map((n) => n.id)));
              markAllNotificationsRead();
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              color: "var(--color-text-muted)",
            }}
          >
            marcar lidas
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((n) => {
          const proType = n.professional?.type ?? "nutri";
          const acc = PRO_ACCENT[proType];
          const isRead = read.has(n.id);
          return (
            <div
              key={n.id}
              onClick={() => {
                if (!isRead) {
                  setRead((s) => new Set(s).add(n.id));
                  markNotificationRead(n.id);
                }
              }}
              style={{
                display: "flex",
                gap: 12,
                padding: "13px 14px",
                borderRadius: "var(--radius-lg)",
                cursor: "pointer",
                background: isRead ? "var(--color-surface-elevated)" : acc.soft,
                border: isRead ? "1px solid var(--color-border)" : acc.border,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "var(--radius-md)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: acc.bg,
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={acc.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={NICON[n.type] ?? NICON.mensagem} />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: isRead ? 600 : 800, color: "var(--color-text)" }}>
                      {n.title}
                    </span>
                    {n.professional && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                          height: 18,
                          padding: "0 7px",
                          borderRadius: "var(--radius-pill)",
                          background: acc.soft,
                        }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: acc.accent }} />
                        <span style={{ fontSize: 10, color: acc.accent }}>
                          {proType === "nutri" ? "nutri" : "personal"}
                        </span>
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)" }}>
                      {relativeLabel(n.created_at)}
                    </span>
                    {!isRead && (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: acc.accent }} />
                    )}
                  </div>
                </div>
                {n.body && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                      marginTop: 4,
                      lineHeight: 1.45,
                    }}
                  >
                    {n.body}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
