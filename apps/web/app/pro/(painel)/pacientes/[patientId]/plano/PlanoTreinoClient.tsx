"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Tag } from "@/components/ui";
import { IconChevronLeft, IconClose, IconPlayOutline } from "@/components/ui/icons";
import { publishTrainingPlan } from "@/lib/pro/actions";

interface DraftExercise {
  name: string;
  reps: string;
  videoUrl: string;
  series: string[]; // carga sugerida por série
}
interface DraftDay {
  name: string;
  rest: boolean;
  exercises: DraftExercise[];
}
export type DraftWeek = Record<number, DraftDay>;

const DOW_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DOW_LABEL = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

const TREINO_PRESETS = [
  "superiores · empurrar",
  "superiores · puxar",
  "inferiores · pernas",
  "superiores · completo",
  "inferiores · completo",
  "cardio leve",
];

export function PlanoTreinoClient({
  patientId,
  patientName,
  initialWeek,
  hadProtocol,
  videos,
}: {
  patientId: string;
  patientName: string;
  initialWeek: DraftWeek;
  hadProtocol: boolean;
  videos: { id: string; name: string; url: string }[];
}) {
  const router = useRouter();
  const [week, setWeek] = useState<DraftWeek>(() => {
    const w: DraftWeek = {};
    for (let d = 0; d < 7; d++)
      w[d] = initialWeek[d]
        ? {
            ...initialWeek[d],
            exercises: initialWeek[d].exercises.map((e) => ({ ...e, series: [...e.series] })),
          }
        : { name: "", rest: true, exercises: [] };
    return w;
  });
  const [dow, setDow] = useState(1);
  const [busy, setBusy] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");

  const day = week[dow];

  function mutate(fn: (w: DraftWeek) => void) {
    setWeek((prev) => {
      const next: DraftWeek = {};
      for (const [k, v] of Object.entries(prev))
        next[Number(k)] = { ...v, exercises: v.exercises.map((e) => ({ ...e, series: [...e.series] })) };
      fn(next);
      return next;
    });
    setPublished(false);
  }

  function stepLoad(value: string, delta: number): string {
    const n = parseFloat(value.replace(",", ".").replace(/[^\d.]/g, ""));
    if (isNaN(n)) return delta > 0 ? "5 kg" : value;
    const next = Math.max(0, n + delta);
    return `${next % 1 === 0 ? next : next.toFixed(1)} kg`;
  }

  async function handlePublish() {
    if (busy) return;
    setBusy(true);
    setError("");
    const result = await publishTrainingPlan({ patientId, week });
    if (!result.ok) {
      setError(result.error ?? "algo deu errado.");
      setBusy(false);
      return;
    }
    setPublished(true);
    setBusy(false);
    router.refresh();
  }

  return (
    <div style={{ padding: "28px 24px", maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <Link
          href={`/pro/pacientes/${patientId}`}
          style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--color-border)", background: "var(--color-surface-elevated)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text)", flexShrink: 0 }}
        >
          <IconChevronLeft size={18} />
        </Link>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 24, letterSpacing: "-0.03em" }}>
            plano de treino · {patientName}
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
            {hadProtocol ? "editando a partir do treino ativo." : "semana nova, do zero."}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: "12px 16px", borderRadius: 12, background: "rgba(173,183,247,0.12)", border: "1px solid rgba(173,183,247,0.30)" }}>
        <span style={{ fontSize: 13, color: "#4a52a8" }}>
          monte a semana de {patientName} dia a dia: o treino, os exercícios, o vídeo de execução,
          as séries e a carga de cada série.
        </span>
      </div>

      {/* dias */}
      <div className="ntrk-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14 }}>
        {DOW_ORDER.map((d) => (
          <button
            key={d}
            onClick={() => setDow(d)}
            style={{
              flexShrink: 0,
              height: 38,
              padding: "0 18px",
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              fontFamily: "var(--font-data)",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              border: dow === d ? "none" : "1px solid var(--color-border-strong)",
              background: dow === d ? "var(--color-orange)" : week[d].rest ? "var(--color-surface)" : "var(--color-surface-elevated)",
              color: dow === d ? "#fff" : week[d].rest ? "var(--color-text-disabled)" : "var(--color-text-secondary)",
            }}
          >
            {DOW_LABEL[d]}
          </button>
        ))}
        <button
          onClick={() => {
            const idx = DOW_ORDER.indexOf(dow);
            const prev = DOW_ORDER[(idx + 6) % 7];
            mutate((w) => {
              w[dow] = { ...w[prev], exercises: w[prev].exercises.map((e) => ({ ...e, series: [...e.series] })) };
            });
          }}
          style={{ flexShrink: 0, height: 38, padding: "0 16px", borderRadius: "var(--radius-pill)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, border: "1px dashed var(--color-border-strong)", background: "transparent", color: "var(--color-text-muted)" }}
        >
          copiar do dia anterior
        </button>
      </div>

      {/* tipo do treino do dia */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>
          treino de {DOW_LABEL[dow]}:
        </span>
        <button
          onClick={() => mutate((w) => void (w[dow].rest = !w[dow].rest))}
          style={{
            height: 34,
            padding: "0 16px",
            borderRadius: "var(--radius-pill)",
            cursor: "pointer",
            fontSize: 12.5,
            fontWeight: 600,
            border: day.rest ? "1px solid var(--color-orange)" : "1px solid var(--color-border-strong)",
            background: day.rest ? "var(--color-orange-subtle)" : "var(--color-surface-elevated)",
            color: day.rest ? "var(--color-orange)" : "var(--color-text-secondary)",
          }}
        >
          descanso
        </button>
        {!day.rest && (
          <>
            <input
              value={day.name}
              onChange={(e) => mutate((w) => void (w[dow].name = e.target.value))}
              placeholder="nome do treino (ex.: inferiores · força)"
              list="treino-presets"
              style={{ flex: 1, minWidth: 200, height: 38, padding: "0 14px", borderRadius: 10, border: "1px solid var(--color-border-strong)", background: "var(--color-surface-elevated)", fontSize: 14, outline: "none" }}
            />
            <datalist id="treino-presets">
              {TREINO_PRESETS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </>
        )}
      </div>

      {day.rest ? (
        <div style={{ maxWidth: 560, background: "var(--mesh-fresh)", borderRadius: "var(--radius-lg)", padding: 26, boxShadow: "var(--shadow-card)", color: "#fff" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em" }}>
            dia de descanso.
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.5, marginTop: 8, opacity: 0.92 }}>
            o corpo assenta o treino da semana. alongar, caminhar e dormir bem também é protocolo.
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
            {day.exercises.map((e, ei) => (
              <Card key={ei} style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  {/* vídeo */}
                  <div style={{ flexShrink: 0, width: 130 }}>
                    <div
                      style={{
                        width: 130,
                        height: 74,
                        borderRadius: 10,
                        background: e.videoUrl ? "var(--mesh-warm)" : "var(--color-surface)",
                        border: e.videoUrl ? "none" : "1px dashed var(--color-border-strong)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: e.videoUrl ? "#fff" : "var(--color-text-muted)",
                      }}
                    >
                      <IconPlayOutline size={20} />
                    </div>
                    <input
                      value={e.videoUrl}
                      onChange={(ev) => mutate((w) => void (w[dow].exercises[ei].videoUrl = ev.target.value))}
                      placeholder="URL do vídeo"
                      list="video-lib"
                      style={{ width: "100%", boxSizing: "border-box", marginTop: 6, height: 30, padding: "0 8px", borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-surface)", fontSize: 11, outline: "none" }}
                    />
                  </div>

                  {/* nome + séries */}
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                      <input
                        value={e.name}
                        onChange={(ev) => mutate((w) => void (w[dow].exercises[ei].name = ev.target.value))}
                        placeholder="nome do exercício"
                        style={{ flex: 1, minWidth: 160, height: 38, padding: "0 12px", borderRadius: 10, border: "1px solid var(--color-border-strong)", background: "var(--color-surface)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, outline: "none" }}
                      />
                      <input
                        value={e.reps}
                        onChange={(ev) => mutate((w) => void (w[dow].exercises[ei].reps = ev.target.value))}
                        placeholder="10 reps"
                        style={{ width: 90, height: 38, padding: "0 10px", borderRadius: 10, border: "1px solid var(--color-border-strong)", background: "var(--color-surface)", fontFamily: "var(--font-data)", fontSize: 13, outline: "none", textAlign: "center" }}
                      />
                      <button
                        onClick={() => mutate((w) => void w[dow].exercises.splice(ei, 1))}
                        style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}
                        title="remover exercício"
                      >
                        <IconClose size={17} />
                      </button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {e.series.map((sr, si) => (
                        <div key={si} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-pill)", padding: "5px 6px 5px 12px" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)" }}>
                            S{si + 1}
                          </span>
                          <button
                            onClick={() => mutate((w) => void (w[dow].exercises[ei].series[si] = stepLoad(sr, -2.5)))}
                            style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid var(--color-border)", background: "var(--color-surface-elevated)", cursor: "pointer", color: "var(--color-text-secondary)", fontWeight: 700 }}
                          >
                            −
                          </button>
                          <input
                            value={sr}
                            onChange={(ev) => mutate((w) => void (w[dow].exercises[ei].series[si] = ev.target.value))}
                            placeholder="carga"
                            style={{ width: 62, height: 24, border: "none", background: "transparent", fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 13, textAlign: "center", outline: "none" }}
                          />
                          <button
                            onClick={() => mutate((w) => void (w[dow].exercises[ei].series[si] = stepLoad(sr, 2.5)))}
                            style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid var(--color-border)", background: "var(--color-surface-elevated)", cursor: "pointer", color: "var(--color-text-secondary)", fontWeight: 700 }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => mutate((w) => void w[dow].exercises[ei].series.splice(si, 1))}
                            style={{ width: 20, height: 20, border: "none", background: "transparent", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <IconClose size={11} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => mutate((w) => void w[dow].exercises[ei].series.push(""))}
                        style={{ display: "flex", alignItems: "center", gap: 6, border: "1px dashed var(--color-border-strong)", borderRadius: "var(--radius-pill)", padding: "5px 14px", cursor: "pointer", color: "var(--color-text-muted)", background: "transparent", fontSize: 12, fontWeight: 600 }}
                      >
                        + série
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <datalist id="video-lib">
            {videos.map((v) => (
              <option key={v.id} value={v.url}>
                {v.name}
              </option>
            ))}
          </datalist>

          <button
            onClick={() =>
              mutate((w) =>
                void w[dow].exercises.push({ name: "", reps: "10 reps", videoUrl: "", series: ["", "", "", ""] }),
              )
            }
            style={{ width: "100%", display: "flex", gap: 10, alignItems: "center", justifyContent: "center", padding: 14, borderRadius: 12, border: "1px dashed var(--color-border-strong)", cursor: "pointer", color: "var(--color-text-muted)", background: "transparent", fontSize: 14, fontWeight: 600, marginBottom: 20 }}
          >
            + adicionar exercício {day.name ? `ao ${day.name}` : ""}
          </button>
        </>
      )}

      {error && <div style={{ margin: "12px 0", fontSize: 13, color: "var(--color-error)" }}>{error}</div>}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
        <button
          onClick={handlePublish}
          disabled={busy}
          style={{ height: 46, padding: "0 26px", borderRadius: "var(--radius-pill)", border: "none", background: published ? "var(--color-success)" : "var(--color-orange)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(254,95,51,0.24)" }}
        >
          {busy ? "publicando..." : published ? "publicado ✓" : "publicar pro aluno"}
        </button>
        <Tag>publica a semana inteira de uma vez</Tag>
      </div>
    </div>
  );
}
