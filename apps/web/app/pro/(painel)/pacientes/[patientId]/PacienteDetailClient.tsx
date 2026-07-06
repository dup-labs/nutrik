"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Card, InitialAvatar, StreakRing } from "@/components/ui";
import { IconChevronLeft, IconFace, MOOD_DEFS } from "@/components/ui/icons";
import { dayNumber, monthShort, relativeLabel, weekdayShort } from "@/lib/dates";
import { addInternalNote, requestCheckin, savePatientDetails } from "@/lib/pro/actions";
import { meshFor, STATUS_BADGE, type ProPatient } from "@/lib/pro/shared";
import { PRO_ACCENT, type ProfessionalType } from "@/lib/types";
import type { PRO_COPY } from "@/lib/pro/copy";

type Copy = (typeof PRO_COPY)["nutri"];

interface Details {
  objetivo: string | null;
  rotina: string | null;
  restricoes: string[];
  historico: string | null;
  sintomas: string[];
  resolvidos: string[];
}

interface Evolution {
  mealAdherence: { name: string; time: string | null; done: number; total: number; pct: number }[];
  waterWeek: { date: string; ml: number; met: boolean }[];
  goal: number;
  sleep: { date: string; hours: number; quality: number | null }[];
  breathCount: number;
  moods: { date: string; mood: string }[];
  checkins: { at: string; body: number; energy: number; clothes: string | null }[];
  sessionsByWeek: { label: string; count: number }[];
  loadSeries: { name: string; points: { date: string; load: number }[]; first: number; last: number }[];
}

const TABS = ["geral", "anamnese", "plano", "evolução", "notas"] as const;

export function PacienteDetailClient({
  proType,
  copy,
  patient,
  details,
  anamnese,
  partner,
  notes,
  evolution,
}: {
  proType: ProfessionalType;
  copy: Copy;
  patient: ProPatient;
  details: Details | null;
  anamnese: {
    wellbeing: number | null;
    energy: number | null;
    symptoms: string[];
    sleep_quality: number | null;
    notes: string | null;
    submitted_at: string;
  } | null;
  partner: { id: string; name: string; short_name: string | null; type: ProfessionalType } | null;
  notes: { id: string; body: string; createdAt: string; mine: boolean; author: string; authorType: ProfessionalType }[];
  evolution: Evolution;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("geral");

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <Link
          href="/pro/pacientes"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-elevated)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text)",
            flexShrink: 0,
          }}
        >
          <IconChevronLeft size={18} />
        </Link>
        <InitialAvatar initial={patient.initial} mesh={meshFor(patient.id)} size={56} />
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 24, letterSpacing: "-0.03em" }}>
              {patient.name}
            </span>
            <Badge variant={STATUS_BADGE[patient.status]} dot>
              {patient.status}
            </Badge>
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
            {copy.pessoa} desde {monthShort(patient.since)} {patient.since.slice(0, 4)} · último
            registro: {patient.lastLabel} · constância {patient.adherence}%
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <CheckinRequestButton patientId={patient.id} />
          <StreakRing days={patient.streak} max={30} size={72} label="dias" />
        </div>
      </div>

      {/* tabs */}
      <div className="ntrk-scroll" style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flexShrink: 0,
              height: 36,
              padding: "0 18px",
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              border: tab === t ? "none" : "1px solid var(--color-border-strong)",
              background: tab === t ? "var(--color-orange)" : "var(--color-surface-elevated)",
              color: tab === t ? "#fff" : "var(--color-text-secondary)",
            }}
          >
            {t === "plano" ? copy.planoTab : t}
          </button>
        ))}
      </div>

      {tab === "geral" && <GeralTab patientId={patient.id} details={details} />}
      {tab === "anamnese" && <AnamneseTab anamnese={anamnese} />}
      {tab === "plano" && (
        <Card style={{ padding: 24, maxWidth: 640 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
            {copy.planoTab} de {patient.name.split(" ")[0]}
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 8, lineHeight: 1.5 }}>
            {copy.planoHint}
          </div>
          <Link
            href={`/pro/pacientes/${patient.id}/plano`}
            style={{
              display: "inline-flex",
              marginTop: 18,
              height: 46,
              padding: "0 24px",
              borderRadius: "var(--radius-pill)",
              background: "var(--color-orange)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              alignItems: "center",
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(254,95,51,0.24)",
            }}
          >
            abrir montador
          </Link>
        </Card>
      )}
      {tab === "evolução" && <EvolucaoTab proType={proType} evolution={evolution} />}
      {tab === "notas" && (
        <NotasTab patientId={patient.id} partner={partner} notes={notes} />
      )}
    </div>
  );
}

function CheckinRequestButton({ patientId }: { patientId: string }) {
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle");
  return (
    <button
      onClick={async () => {
        if (state !== "idle") return;
        setState("busy");
        await requestCheckin({ patientId });
        setState("sent");
      }}
      style={{
        height: 38,
        padding: "0 16px",
        borderRadius: "var(--radius-pill)",
        border: state === "sent" ? "1px solid rgba(47,158,107,0.4)" : "1px solid var(--color-border-strong)",
        background: state === "sent" ? "rgba(47,158,107,0.10)" : "var(--color-surface-elevated)",
        fontSize: 13,
        fontWeight: 600,
        color: state === "sent" ? "#2f9e6b" : "var(--color-text-secondary)",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {state === "sent" ? "check-in solicitado ✓" : state === "busy" ? "enviando..." : "solicitar check-in"}
    </button>
  );
}

/* ── aba geral ── */
function GeralTab({ patientId, details }: { patientId: string; details: Details | null }) {
  const [editing, setEditing] = useState(false);
  const [objetivo, setObjetivo] = useState(details?.objetivo ?? "");
  const [rotina, setRotina] = useState(details?.rotina ?? "");
  const [restricoes, setRestricoes] = useState((details?.restricoes ?? []).join(", "));
  const [historico, setHistorico] = useState(details?.historico ?? "");
  const [sintomas, setSintomas] = useState((details?.sintomas ?? []).join(", "));
  const [resolvidos, setResolvidos] = useState((details?.resolvidos ?? []).join(", "));
  const [busy, setBusy] = useState(false);

  const parse = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

  async function handleSave() {
    setBusy(true);
    await savePatientDetails({
      patientId,
      objetivo,
      rotina,
      restricoes: parse(restricoes),
      historico,
      sintomas: parse(sintomas),
      resolvidos: parse(resolvidos),
    });
    setEditing(false);
    setBusy(false);
  }

  const field = (label: string, value: string, set: (v: string) => void, area = false) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-muted)", marginBottom: 6 }}>
        {label}
      </div>
      {editing ? (
        area ? (
          <textarea
            value={value}
            onChange={(e) => set(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", minHeight: 64, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--color-border-strong)", background: "var(--color-surface)", fontSize: 14, lineHeight: 1.5, outline: "none", resize: "none" }}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => set(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", height: 42, padding: "0 12px", borderRadius: 10, border: "1px solid var(--color-border-strong)", background: "var(--color-surface)", fontSize: 14, outline: "none" }}
          />
        )
      ) : (
        <div style={{ fontSize: 14, lineHeight: 1.55, color: value ? "var(--color-text-secondary)" : "var(--color-text-disabled)" }}>
          {value || "—"}
        </div>
      )}
    </div>
  );

  const chips = (label: string, items: string[], color: string) =>
    items.length > 0 && (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-muted)", marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {items.map((t) => (
            <span key={t} style={{ height: 28, padding: "0 12px", borderRadius: "var(--radius-pill)", background: color, display: "inline-flex", alignItems: "center", fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, maxWidth: 900 }}>
      <Card style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>o caso</span>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            disabled={busy}
            style={{ height: 32, padding: "0 14px", borderRadius: "var(--radius-pill)", border: "1px solid var(--color-border-strong)", background: editing ? "var(--color-orange)" : "var(--color-surface)", color: editing ? "#fff" : "var(--color-text-secondary)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            {busy ? "salvando..." : editing ? "salvar" : "editar"}
          </button>
        </div>
        {field("objetivo", objetivo, setObjetivo, true)}
        {field("rotina", rotina, setRotina, true)}
        {field("histórico", historico, setHistorico, true)}
        {editing && field("restrições (separadas por vírgula)", restricoes, setRestricoes)}
        {!editing && chips("restrições", (details?.restricoes ?? []), "rgba(239,68,68,0.08)")}
      </Card>
      <Card style={{ padding: 22 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
          como chegou · como está
        </div>
        {editing ? (
          <>
            {field("sintomas de chegada (vírgula)", sintomas, setSintomas)}
            {field("já resolvidos (vírgula)", resolvidos, setResolvidos)}
          </>
        ) : (
          <>
            {chips("sintomas de chegada", details?.sintomas ?? [], "rgba(254,175,76,0.14)")}
            {chips("já resolvidos", details?.resolvidos ?? [], "rgba(47,158,107,0.12)")}
            {(details?.sintomas ?? []).length === 0 && (details?.resolvidos ?? []).length === 0 && (
              <div style={{ fontSize: 13, color: "var(--color-text-disabled)" }}>
                nada registrado ainda. clica em editar pra preencher o caso.
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

/* ── aba anamnese ── */
function AnamneseTab({
  anamnese,
}: {
  anamnese: {
    wellbeing: number | null;
    energy: number | null;
    symptoms: string[];
    sleep_quality: number | null;
    notes: string | null;
    submitted_at: string;
  } | null;
}) {
  if (!anamnese) {
    return (
      <Card style={{ padding: 24, maxWidth: 640 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
          sem anamnese ainda.
        </div>
        <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6 }}>
          a anamnese aparece aqui assim que for preenchida no app.
        </div>
      </Card>
    );
  }
  const scale = (label: string, value: number | null, max = 5) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 13 }}>
          {value ?? "—"}/{max}
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: "var(--color-surface)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((value ?? 0) / max) * 100}%`, borderRadius: 99, background: "linear-gradient(90deg,#fe5f33,#feaf4c)" }} />
      </div>
    </div>
  );
  return (
    <Card style={{ padding: 24, maxWidth: 640 }}>
      <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 16 }}>
        enviada em {relativeLabel(anamnese.submitted_at)}
      </div>
      {scale("como chega (bem-estar)", anamnese.wellbeing)}
      {scale("energia na semana", anamnese.energy)}
      {scale("qualidade do sono", anamnese.sleep_quality)}
      {anamnese.symptoms.length > 0 && (
        <div style={{ margin: "16px 0" }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-muted)", marginBottom: 8 }}>
            o que pesava
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {anamnese.symptoms.map((t) => (
              <span key={t} style={{ height: 28, padding: "0 12px", borderRadius: "var(--radius-pill)", background: "rgba(254,175,76,0.14)", display: "inline-flex", alignItems: "center", fontSize: 12, color: "#c67518" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
      {anamnese.notes && (
        <div style={{ padding: "12px 14px", borderRadius: 10, background: "var(--color-surface)", border: "1px solid var(--color-border)", fontSize: 14, lineHeight: 1.5, color: "var(--color-text-secondary)", fontStyle: "italic" }}>
          &ldquo;{anamnese.notes}&rdquo;
        </div>
      )}
    </Card>
  );
}

/* ── aba evolução ── */
function EvolucaoTab({ proType, evolution }: { proType: ProfessionalType; evolution: Evolution }) {
  const topics =
    proType === "personal"
      ? (["treino", "refeições", "água", "sono & mente", "humor"] as const)
      : (["refeições", "água", "sono & mente", "humor", "treino"] as const);
  const [topic, setTopic] = useState<string>(topics[0]);

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="ntrk-scroll" style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            style={{
              flexShrink: 0,
              height: 32,
              padding: "0 16px",
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 600,
              border: topic === t ? "1px solid var(--color-orange)" : "1px solid var(--color-border-strong)",
              background: topic === t ? "var(--color-orange-subtle)" : "var(--color-surface-elevated)",
              color: topic === t ? "var(--color-orange)" : "var(--color-text-secondary)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {topic === "refeições" && (
        <Card style={{ padding: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 16 }}>
            aderência por refeição · últimos 28 dias
          </div>
          {evolution.mealAdherence.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>sem plano ativo com refeições diárias.</div>
          ) : (
            evolution.mealAdherence.map((m) => (
              <div key={m.name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>
                    {m.name}{" "}
                    <span style={{ fontFamily: "var(--font-data)", fontWeight: 500, fontSize: 12, color: "var(--color-text-muted)" }}>
                      {m.time ? `~${m.time}` : ""}
                    </span>
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 13, color: "var(--color-orange)" }}>
                    {m.pct}% · {m.done} de {m.total}
                  </span>
                </div>
                <div style={{ height: 10, borderRadius: 99, background: "var(--color-surface)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.pct}%`, borderRadius: 99, background: "linear-gradient(90deg,#fe5f33,#feaf4c)" }} />
                </div>
              </div>
            ))
          )}
        </Card>
      )}

      {topic === "água" && (
        <Card style={{ padding: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 16 }}>
            água na semana · meta {(evolution.goal / 1000).toFixed(1).replace(".", ",")} l
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 120 }}>
            {evolution.waterWeek.map((d) => (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                <div style={{ flex: 1, width: "100%", maxWidth: 40, display: "flex", alignItems: "flex-end" }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.min(100, (d.ml / evolution.goal) * 100)}%`,
                      minHeight: d.ml > 0 ? 4 : 0,
                      borderRadius: 6,
                      background: d.met ? "var(--cool-mint)" : "var(--cool-lav)",
                    }}
                  />
                </div>
                <span style={{ fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                  {weekdayShort(d.date)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {topic === "sono & mente" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <Card style={{ padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 16 }}>
              sono · últimos 14 dias
            </div>
            {evolution.sleep.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>sem registros de sono.</div>
            ) : (
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 100 }}>
                {evolution.sleep.map((s) => (
                  <div key={s.date} title={`${dayNumber(s.date)} · ${s.hours}h`} style={{ flex: 1, display: "flex", alignItems: "flex-end", height: "100%" }}>
                    <div style={{ width: "100%", height: `${Math.min(100, (s.hours / 10) * 100)}%`, borderRadius: 4, background: (s.quality ?? 3) >= 4 ? "var(--cool-lav)" : "rgba(173,183,247,0.4)" }} />
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card style={{ padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 12 }}>
              pausas de mente · 30 dias
            </div>
            <div style={{ fontFamily: "var(--font-data)", fontWeight: 900, fontSize: 40, letterSpacing: "-0.03em", color: "#5a63c4", lineHeight: 1 }}>
              {evolution.breathCount}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 6 }}>
              respirações guiadas concluídas
            </div>
          </Card>
        </div>
      )}

      {topic === "humor" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <Card style={{ padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 16 }}>
              humor · últimos 14 dias
            </div>
            {evolution.moods.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>sem registros de humor.</div>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {evolution.moods.map((m) => {
                  const def = MOOD_DEFS.find((d) => d.key === m.mood);
                  return (
                    <div key={m.date} title={m.date} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <IconFace mouth={def?.mouth ?? "M9 15.5 L15 15.5"} size={26} color={def?.color ?? "#6b6f78"} />
                      <span style={{ fontSize: 9, fontFamily: "var(--font-data)", color: "var(--color-text-muted)" }}>
                        {dayNumber(m.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
          <Card style={{ padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 12 }}>
              check-ins do mês
            </div>
            {evolution.checkins.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>sem check-ins ainda.</div>
            ) : (
              evolution.checkins.map((c, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: "var(--color-surface)", border: "1px solid var(--color-border)", marginBottom: 8 }}>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-text-muted)", marginBottom: 4 }}>
                    {relativeLabel(c.at)}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                    corpo {c.body}/5 · energia {c.energy}/5{c.clothes ? ` · roupa ${c.clothes}` : ""}
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      )}

      {topic === "treino" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <Card style={{ padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 16 }}>
              treinos concluídos por semana
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-end", height: 110 }}>
              {evolution.sessionsByWeek.map((w) => (
                <div key={w.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", maxWidth: 46, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                    <div style={{ width: "100%", height: `${Math.min(100, (w.count / 6) * 100)}%`, minHeight: w.count > 0 ? 6 : 0, borderRadius: 6, background: "linear-gradient(180deg,#fe8f3c,#feaf4c)" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 13 }}>{w.count}</span>
                  <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>{w.label}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 16 }}>
              evolução de carga
            </div>
            {evolution.loadSeries.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                ainda sem cargas registradas em dois dias diferentes.
              </div>
            ) : (
              evolution.loadSeries.map((e) => (
                <div key={e.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{e.name}</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: 13 }}>
                    <span style={{ color: "var(--color-text-muted)" }}>{e.first}kg</span>
                    {" → "}
                    <span style={{ color: "var(--color-orange)", fontWeight: 700 }}>{e.last}kg</span>
                    <span style={{ color: e.last >= e.first ? "#2f9e6b" : "var(--color-error)", marginLeft: 8, fontSize: 12 }}>
                      {e.last >= e.first ? "+" : ""}
                      {Math.round(((e.last - e.first) / (e.first || 1)) * 100)}%
                    </span>
                  </span>
                </div>
              ))
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

/* ── aba notas com o par ── */
function NotasTab({
  patientId,
  partner,
  notes,
}: {
  patientId: string;
  partner: { id: string; name: string; short_name: string | null; type: ProfessionalType } | null;
  notes: { id: string; body: string; createdAt: string; mine: boolean; author: string; authorType: ProfessionalType }[];
}) {
  const [draft, setDraft] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);
  const [busy, setBusy] = useState(false);

  async function handleSend() {
    const body = draft.trim();
    if (!body || busy) return;
    setBusy(true);
    setDraft("");
    setLocalNotes((n) => [
      ...n,
      { id: `tmp-${Date.now()}`, body, createdAt: new Date().toISOString(), mine: true, author: "você", authorType: "nutri" },
    ]);
    await addInternalNote({ patientId, body });
    setBusy(false);
  }

  return (
    <Card style={{ padding: 22, maxWidth: 640 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>
          notas com o par
        </span>
        {partner && (
          <Badge variant={partner.type === "nutri" ? "cool" : "warm"} dot>
            {partner.short_name ?? partner.name} · {PRO_ACCENT[partner.type].role}
          </Badge>
        )}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--color-text-muted)", marginBottom: 18 }}>
        conversa interna sobre este caso — invisível pro paciente.
        {!partner && " ainda não há outro profissional vinculado a este paciente."}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        {localNotes.map((n) => (
          <div key={n.id} style={{ display: "flex", flexDirection: "column", alignItems: n.mine ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "85%",
                padding: "11px 14px",
                borderRadius: n.mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: n.mine ? PRO_ACCENT[n.authorType]?.bg ?? "var(--color-orange-dim)" : "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              {!n.mine && (
                <div style={{ fontSize: 11, fontWeight: 700, color: PRO_ACCENT[n.authorType]?.accent ?? "var(--color-text-muted)", marginBottom: 3 }}>
                  {n.author}
                </div>
              )}
              <div style={{ fontSize: 14, lineHeight: 1.45 }}>{n.body}</div>
            </div>
            <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)", marginTop: 3, padding: "0 4px" }}>
              {relativeLabel(n.createdAt)}
            </span>
          </div>
        ))}
        {localNotes.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--color-text-muted)", textAlign: "center", padding: "16px 0" }}>
            nenhuma nota ainda. o que você observar aqui, o par vê.
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="deixa uma observação pro par..."
          style={{ flex: 1, height: 44, padding: "0 16px", borderRadius: "var(--radius-pill)", border: "1px solid var(--color-border-strong)", background: "var(--color-surface)", fontSize: 14, outline: "none" }}
        />
        <button
          onClick={handleSend}
          disabled={busy}
          style={{ height: 44, padding: "0 20px", borderRadius: "var(--radius-pill)", border: "none", background: "var(--color-orange)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
        >
          enviar
        </button>
      </div>
    </Card>
  );
}
