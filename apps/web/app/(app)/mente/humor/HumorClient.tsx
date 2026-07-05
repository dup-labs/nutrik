"use client";

import { useState } from "react";
import { BackHeader, PrimaryButton } from "@/components/ui";
import { IconCheck, IconFace, MOOD_DEFS } from "@/components/ui/icons";
import { saveMood } from "@/lib/actions";

const TAGS = ["sono", "trabalho", "treino", "ansiedade", "gratidão", "família"];

export function HumorClient({
  date,
  initialMood,
  initialTags,
}: {
  date: string;
  initialMood: string | null;
  initialTags: string[];
}) {
  const [mood, setMood] = useState<string | null>(initialMood);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    if (!mood || busy) return;
    setBusy(true);
    await saveMood({ date, mood, tags });
    setSaved(true);
    setBusy(false);
  }

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 640, margin: "0 auto" }}>
      <BackHeader href="/mente" title="como você tá hoje?" />

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 26 }}>
        {MOOD_DEFS.map((m) => {
          const sel = mood === m.key;
          return (
            <button
              key={m.key}
              onClick={() => {
                setMood(m.key);
                setSaved(false);
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: sel ? m.bg : "var(--color-surface)",
                  border: sel ? `2px solid ${m.color}` : "2px solid transparent",
                  transition: "all .2s var(--ease-spring)",
                  transform: sel ? "scale(1.12)" : "scale(1)",
                }}
              >
                <IconFace mouth={m.mouth} size={30} color={sel ? m.color : "var(--color-text-muted)"} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: sel ? m.color : "var(--color-text-muted)",
                }}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
        o que pesou hoje?
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {TAGS.map((t) => {
          const on = tags.includes(t);
          return (
            <button
              key={t}
              onClick={() => {
                setTags((s) => (on ? s.filter((x) => x !== t) : [...s, t]));
                setSaved(false);
              }}
              style={{
                height: 34,
                padding: "0 14px",
                borderRadius: "var(--radius-pill)",
                display: "flex",
                alignItems: "center",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                background: on ? "var(--color-orange-subtle)" : "var(--color-surface)",
                color: on ? "var(--color-orange)" : "var(--color-text-secondary)",
                border: on ? "1px solid var(--color-orange-dim)" : "1px solid var(--color-border-strong)",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <PrimaryButton disabled={!mood || busy} onClick={handleSave}>
        {busy ? "registrando..." : "registrar"}
      </PrimaryButton>

      {saved && (
        <div
          style={{
            marginTop: 18,
            background: "rgba(47,158,107,0.10)",
            border: "1px solid rgba(47,158,107,0.24)",
            borderRadius: "var(--radius-md)",
            padding: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <IconCheck size={22} color="#2f9e6b" />
          <span style={{ fontSize: 14, color: "#2f9e6b", fontWeight: 500 }}>
            registrado. obrigado por chegar até aqui hoje.
          </span>
        </div>
      )}
    </div>
  );
}
