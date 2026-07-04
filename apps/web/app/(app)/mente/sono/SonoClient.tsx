"use client";

import Link from "next/link";
import { useState } from "react";
import { BackHeader, PrimaryButton } from "@/components/ui";
import { IconMoon } from "@/components/ui/icons";
import { saveSleep } from "@/lib/actions";

export function SonoClient({
  date,
  initialHours,
  initialQuality,
  initialWakeMood,
}: {
  date: string;
  initialHours: number;
  initialQuality: number | null;
  initialWakeMood: number | null;
}) {
  const [hours, setHours] = useState(initialHours);
  const [quality, setQuality] = useState<number | null>(initialQuality);
  const [wakeMood, setWakeMood] = useState<number | null>(initialWakeMood);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    if (!quality || !wakeMood || busy) return;
    setBusy(true);
    await saveSleep({ date, hours, quality, wakeMood });
    setSaved(true);
    setBusy(false);
  }

  if (saved) {
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
            background: "var(--mesh-fresh)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "ntrkPop .5s var(--ease-spring) both",
          }}
        >
          <IconMoon size={32} color="#fff" strokeWidth={1.8} />
        </div>
        <div style={{ marginTop: 20, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 23, letterSpacing: "-0.03em" }}>
          registrado.
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
          {[
            { label: "sono", value: `${hours}h` },
            { label: "qualidade", value: `${quality}/5` },
            { label: "humor", value: `${wakeMood}/5` },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)" }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "var(--font-data)", fontSize: 22, color: "#5a63c4", marginTop: 3 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/mente"
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
          voltar
        </Link>
      </div>
    );
  }

  const scale = (val: number | null, set: (n: number) => void, tint: string) => (
    <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => set(n)}
          style={{
            flex: 1,
            height: 46,
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            background: val === n ? tint : "var(--color-surface)",
            border: val === n ? "1.5px solid rgba(27,28,29,0.25)" : "1px solid var(--color-border-strong)",
            color: val === n ? "var(--color-text)" : "var(--color-text-muted)",
            fontFamily: "var(--font-data)",
            fontSize: 15,
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ padding: "24px 20px 28px" }}>
      <BackHeader href="/mente" title="seu sono" subtitle="descanso é onde a evolução acontece." />

      <div
        style={{
          background: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: 22,
          boxShadow: "var(--shadow-card)",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 16 }}>
          quanto você dormiu?
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <button
            onClick={() => setHours((h) => Math.max(0, h - 1))}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>
          <div>
            <span style={{ fontFamily: "var(--font-data)", fontWeight: 900, fontSize: 48, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {hours}
            </span>
            <span style={{ fontSize: 16, color: "var(--color-text-muted)", marginLeft: 4 }}>h</span>
          </div>
          <button
            onClick={() => setHours((h) => Math.min(12, h + 1))}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid rgba(173,183,247,0.4)",
              background: "rgba(173,183,247,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#5a63c4",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
        como foi a qualidade?
      </div>
      {scale(quality, (n) => setQuality(n), "rgba(173,183,247,0.24)")}

      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
        e o humor ao acordar?
      </div>
      {scale(wakeMood, (n) => setWakeMood(n), "rgba(254,175,76,0.2)")}

      <PrimaryButton disabled={!quality || !wakeMood || busy} onClick={handleSave} style={{ marginTop: 4 }}>
        {busy ? "salvando..." : "salvar registro"}
      </PrimaryButton>
    </div>
  );
}
