"use client";

import Link from "next/link";
import { useState } from "react";
import { BackHeader, PrimaryButton } from "@/components/ui";
import { IconCalendar } from "@/components/ui/icons";
import { requestAppointment } from "@/lib/actions";
import { dayNumber, monthShort, weekdayShort } from "@/lib/dates";
import { PRO_ACCENT, type ProfessionalType } from "@/lib/types";

const TIMES = ["08:00", "09:00", "10:00", "11:00", "14:30", "15:30", "17:00"];
const TYPES: { key: "retorno" | "avaliacao" | "primeira"; label: string }[] = [
  { key: "retorno", label: "retorno" },
  { key: "avaliacao", label: "avaliação" },
  { key: "primeira", label: "1ª consulta" },
];

export function AgendarClient({
  pros,
  dates,
}: {
  pros: { id: string; type: ProfessionalType; name: string; fullName: string }[];
  dates: string[];
}) {
  const [proId, setProId] = useState(pros[0].id);
  const [type, setType] = useState<"retorno" | "avaliacao" | "primeira">("retorno");
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  const pro = pros.find((p) => p.id === proId)!;
  const acc = PRO_ACCENT[pro.type];

  async function handleConfirm() {
    if (!time || busy) return;
    setBusy(true);
    await requestAppointment({
      professionalId: proId,
      type,
      scheduledAt: `${date}T${time}:00`,
    });
    setConfirmed(true);
    setBusy(false);
  }

  if (confirmed) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "calc(100dvh - 160px)",
          padding: "0 30px",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: "var(--mesh-cool)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "ntrkPop .5s var(--ease-spring) both",
            color: "#fff",
          }}
        >
          <IconCalendar size={34} color="#fff" strokeWidth={2} />
        </div>
        <div style={{ marginTop: 20, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 23, letterSpacing: "-0.03em" }}>
          solicitação enviada.
        </div>
        <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.5, color: "var(--color-text-secondary)", maxWidth: 280 }}>
          {pro.fullName} recebe seu pedido e confirma o horário com você.
        </div>
        <Link
          href="/consultas"
          style={{
            marginTop: 30,
            height: 52,
            padding: "0 36px",
            borderRadius: "var(--radius-pill)",
            background: "var(--color-orange)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          ver consultas
        </Link>
      </div>
    );
  }

  const pill = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "11px 8px",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
    background: active ? acc.bg : "var(--color-surface)",
    border: active ? `1.5px solid ${acc.accent}` : "1px solid var(--color-border-strong)",
    color: active ? acc.accent : "var(--color-text-secondary)",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    transition: "all .15s var(--ease-out)",
  });

  const label = (t: string) => (
    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
      {t}
    </div>
  );

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 760, margin: "0 auto" }}>
      <BackHeader href="/consultas" title="novo agendamento" />

      {label("com quem?")}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {pros.map((p) => (
          <button
            key={p.id}
            style={pill(proId === p.id)}
            onClick={() => {
              setProId(p.id);
              setTime(null);
            }}
          >
            {p.name} · {p.type === "nutri" ? "nutri" : "personal"}
          </button>
        ))}
      </div>

      {label("tipo de consulta")}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {TYPES.map((t) => (
          <button key={t.key} style={pill(type === t.key)} onClick={() => setType(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {label("data")}
      <div
        className="ntrk-scroll"
        style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 2 }}
      >
        {dates.map((d) => {
          const sel = date === d;
          return (
            <button
              key={d}
              onClick={() => {
                setDate(d);
                setTime(null);
              }}
              style={{
                flexShrink: 0,
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                background: sel ? acc.bg : "var(--color-surface)",
                border: sel ? `1.5px solid ${acc.accent}` : "1px solid var(--color-border-strong)",
              }}
            >
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: sel ? acc.accent : "var(--color-text)" }}>
                {weekdayShort(d)}
              </span>
              <span style={{ fontFamily: "var(--font-data)", fontSize: 19, lineHeight: 1, color: sel ? acc.accent : "var(--color-text)" }}>
                {dayNumber(d)}
              </span>
              <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>{monthShort(d)}</span>
            </button>
          );
        })}
      </div>

      {label("horário")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
        {TIMES.map((t) => {
          const sel = time === t;
          return (
            <button
              key={t}
              onClick={() => setTime(t)}
              style={{
                padding: "10px 16px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontFamily: "var(--font-data)",
                fontSize: 14,
                background: sel ? acc.bg : "var(--color-surface)",
                border: sel ? `1.5px solid ${acc.accent}` : "1px solid var(--color-border-strong)",
                color: sel ? acc.accent : "var(--color-text-secondary)",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <PrimaryButton disabled={!time || busy} onClick={handleConfirm}>
        {busy ? "enviando..." : "confirmar solicitação"}
      </PrimaryButton>
    </div>
  );
}
