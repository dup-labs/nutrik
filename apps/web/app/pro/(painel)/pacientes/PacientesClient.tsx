"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Card, InitialAvatar } from "@/components/ui";
import { IconChevronRight, IconCopy, IconFlame } from "@/components/ui/icons";
import { meshFor, STATUS_BADGE, type PatientStatus, type ProPatient } from "@/lib/pro/shared";

const FILTERS: ("todos" | PatientStatus)[] = ["todos", "em dia", "atenção", "sumindo"];

export function PacientesClient({
  patients,
  copy,
  inviteCode,
}: {
  patients: ProPatient[];
  copy: { pessoas: string };
  inviteCode: string;
}) {
  const [filter, setFilter] = useState<"todos" | PatientStatus>("todos");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = patients.filter(
    (p) =>
      (filter === "todos" || p.status === filter) &&
      (!search.trim() || p.name.toLowerCase().includes(search.trim().toLowerCase())),
  );

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em" }}>
            {copy.pessoas}
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
            {patients.length} no total
          </div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 42,
            padding: "0 16px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--color-border-strong)",
            background: "var(--color-surface-elevated)",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          <IconCopy size={15} />
          {copied ? "copiado!" : `convite: ${inviteCode}`}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {FILTERS.map((f) => {
          const count = f === "todos" ? patients.length : patients.filter((p) => p.status === f).length;
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                height: 34,
                padding: "0 16px",
                borderRadius: "var(--radius-pill)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                border: `1px solid ${active ? "var(--color-orange)" : "var(--color-border-strong)"}`,
                background: active ? "var(--color-orange-subtle)" : "var(--color-surface-elevated)",
                color: active ? "var(--color-orange)" : "var(--color-text-secondary)",
              }}
            >
              {f} · {count}
            </button>
          );
        })}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="buscar por nome..."
        style={{
          width: "100%",
          boxSizing: "border-box",
          height: 44,
          padding: "0 16px",
          borderRadius: 12,
          border: "1px solid var(--color-border-strong)",
          background: "var(--color-surface-elevated)",
          fontSize: 14,
          outline: "none",
          marginBottom: 14,
        }}
      />

      {filtered.length === 0 ? (
        <Card style={{ padding: "32px 22px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
            {patients.length === 0 ? `nenhum ${copy.pessoas.slice(0, -1)} ainda.` : "ninguém aqui com esse filtro."}
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6, lineHeight: 1.5 }}>
            {patients.length === 0
              ? `compartilha seu código de convite (${inviteCode}) que a pessoa entra vinculada a você.`
              : "tenta outro filtro ou busca."}
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((p) => (
            <Link key={p.id} href={`/pro/pacientes/${p.id}`} style={{ textDecoration: "none" }}>
              <Card
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  cursor: "pointer",
                }}
              >
                <InitialAvatar initial={p.initial} mesh={meshFor(p.id)} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)" }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--color-text-muted)", marginTop: 2 }}>
                    último registro: {p.lastLabel}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                  <div style={{ textAlign: "right", minWidth: 70 }}>
                    <div style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 16, color: p.adherence >= 70 ? "var(--color-orange)" : p.adherence >= 50 ? "#c67518" : "var(--color-error)" }}>
                      {p.adherence}%
                    </div>
                    <div style={{ fontSize: 10, color: "var(--color-text-muted)" }}>constância</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 44 }}>
                    <IconFlame size={15} color="#fe5f33" />
                    <span style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 14, color: "#c67518" }}>
                      {p.streak}
                    </span>
                  </div>
                  <Badge variant={STATUS_BADGE[p.status]} dot>
                    {p.status}
                  </Badge>
                  <IconChevronRight size={18} color="var(--color-text-muted)" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
