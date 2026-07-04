"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui";
import { IconChevronLeft, IconClose } from "@/components/ui/icons";
import { publishMealPlan } from "@/lib/pro/actions";

export interface Food {
  id: string;
  name: string;
  unit: string;
  base: number;
  p: number;
  c: number;
  g: number;
  kcal: number;
}

interface DraftMeal {
  name: string;
  time: string;
  foods: { foodId: string; qty: number }[];
}
export type DraftPlan = Record<number, DraftMeal[]>;

const DOW_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DOW_LABEL = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

const DEFAULT_MEALS: DraftMeal[] = [
  { name: "café da manhã", time: "07:30", foods: [] },
  { name: "almoço", time: "12:30", foods: [] },
  { name: "lanche da tarde", time: "16:00", foods: [] },
  { name: "jantar", time: "19:30", foods: [] },
];

export function PlanoAlimentarClient({
  patientId,
  patientName,
  foods,
  initialDraft,
  hadProtocol,
}: {
  patientId: string;
  patientName: string;
  foods: Food[];
  initialDraft: DraftPlan;
  hadProtocol: boolean;
}) {
  const router = useRouter();
  const foodById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);

  const [plan, setPlan] = useState<DraftPlan>(() => {
    const p: DraftPlan = {};
    for (let d = 0; d < 7; d++) {
      p[d] =
        initialDraft[d] && initialDraft[d].length > 0
          ? initialDraft[d].map((m) => ({ ...m, foods: [...m.foods] }))
          : DEFAULT_MEALS.map((m) => ({ ...m, foods: [] }));
    }
    return p;
  });
  const [dow, setDow] = useState(1);
  const [mealIdx, setMealIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");

  const dayMeals = plan[dow] ?? [];
  const selMeal = dayMeals[Math.min(mealIdx, dayMeals.length - 1)];

  function macrosOf(entries: { foodId: string; qty: number }[]) {
    return entries.reduce(
      (a, e) => {
        const f = foodById.get(e.foodId);
        if (!f) return a;
        const k = e.qty / (f.base || 1);
        return { p: a.p + f.p * k, c: a.c + f.c * k, g: a.g + f.g * k, kcal: a.kcal + f.kcal * k };
      },
      { p: 0, c: 0, g: 0, kcal: 0 },
    );
  }
  const r = (n: number) => Math.round(n);
  const dayTotal = macrosOf(dayMeals.flatMap((m) => m.foods));

  function mutate(fn: (p: DraftPlan) => void) {
    setPlan((prev) => {
      const next: DraftPlan = {};
      for (const [k, v] of Object.entries(prev))
        next[Number(k)] = v.map((m) => ({ ...m, foods: m.foods.map((f) => ({ ...f })) }));
      fn(next);
      return next;
    });
    setPublished(false);
  }

  const results = query.trim()
    ? foods.filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : [];

  function stepFor(unit: string) {
    return unit === "g" || unit === "ml" ? 25 : 1;
  }
  function qtyLabel(e: { foodId: string; qty: number }) {
    const f = foodById.get(e.foodId);
    if (!f) return "";
    return f.unit === "g" || f.unit === "ml" ? `${e.qty} ${f.unit}` : `${e.qty} ${f.unit}`;
  }

  async function handlePublish() {
    if (busy) return;
    setBusy(true);
    setError("");
    const result = await publishMealPlan({ patientId, planByDay: plan });
    if (!result.ok) {
      setError(result.error ?? "algo deu errado.");
      setBusy(false);
      return;
    }
    setPublished(true);
    setBusy(false);
    router.refresh();
  }

  const macroChip = (label: string, value: number, color: string, size = 11) => (
    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: size, color: "var(--color-text-muted)" }}>
      <span style={{ width: 7, height: 7, borderRadius: 2, background: color }} />
      {label} {r(value)}g
    </span>
  );

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <Link
          href={`/pro/pacientes/${patientId}`}
          style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--color-border)", background: "var(--color-surface-elevated)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text)", flexShrink: 0 }}
        >
          <IconChevronLeft size={18} />
        </Link>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 24, letterSpacing: "-0.03em" }}>
            plano alimentar · {patientName}
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
            {hadProtocol ? "editando a partir do plano ativo." : "plano novo, do zero."}
          </div>
        </div>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: "12px 16px", borderRadius: 12, background: "rgba(173,183,247,0.12)", border: "1px solid rgba(173,183,247,0.30)" }}
      >
        <span style={{ fontSize: 13, color: "#4a52a8" }}>
          monte o plano dia a dia. os macros somam sozinhos conforme você adiciona alimentos e
          quantidades — e {patientName} vê tudo no app.
        </span>
      </div>

      {/* dias */}
      <div className="ntrk-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18 }}>
        {DOW_ORDER.map((d) => (
          <button
            key={d}
            onClick={() => {
              setDow(d);
              setMealIdx(0);
              setQuery("");
            }}
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
              background: dow === d ? "var(--color-orange)" : "var(--color-surface-elevated)",
              color: dow === d ? "#fff" : "var(--color-text-secondary)",
            }}
          >
            {DOW_LABEL[d]}
          </button>
        ))}
        <button
          onClick={() => {
            // copia o dia anterior (na ordem de exibição)
            const idx = DOW_ORDER.indexOf(dow);
            const prev = DOW_ORDER[(idx + 6) % 7];
            mutate((p) => {
              p[dow] = p[prev].map((m) => ({ ...m, foods: m.foods.map((f) => ({ ...f })) }));
            });
          }}
          style={{ flexShrink: 0, height: 38, padding: "0 16px", borderRadius: "var(--radius-pill)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, border: "1px dashed var(--color-border-strong)", background: "transparent", color: "var(--color-text-muted)" }}
        >
          copiar do dia anterior
        </button>
      </div>

      <div className="plano-grid" style={{ display: "grid", gap: 20, alignItems: "start" }}>
        {/* refeições do dia */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {dayMeals.map((m, i) => {
            const tot = macrosOf(m.foods);
            const sel = i === mealIdx;
            return (
              <div
                key={i}
                onClick={() => setMealIdx(i)}
                style={{
                  cursor: "pointer",
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: sel ? "var(--color-orange-subtle)" : "var(--color-surface-elevated)",
                  border: sel ? "1.5px solid var(--color-orange-dim)" : "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{m.name}</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: 12, color: "var(--color-text-muted)" }}>
                    ~{m.time}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <span style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 13 }}>
                    {r(tot.kcal)} kcal
                  </span>
                  {macroChip("P", tot.p, "var(--color-orange)")}
                  {macroChip("C", tot.c, "var(--warm-amber)")}
                  {macroChip("G", tot.g, "var(--cool-lav)")}
                </div>
              </div>
            );
          })}

          <button
            onClick={() =>
              mutate((p) => {
                p[dow].push({ name: "ceia", time: "21:30", foods: [] });
              })
            }
            style={{ display: "flex", gap: 9, alignItems: "center", justifyContent: "center", padding: "12px 14px", borderRadius: 12, border: "1px dashed var(--color-border-strong)", cursor: "pointer", color: "var(--color-text-muted)", background: "transparent", fontSize: 13, fontWeight: 600 }}
          >
            + adicionar refeição
          </button>

          <div style={{ background: "var(--mesh-cool)", borderRadius: "var(--radius-lg)", padding: 18, boxShadow: "var(--shadow-card)", color: "#fff" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
              total de {DOW_LABEL[dow]}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span style={{ fontFamily: "var(--font-data)", fontWeight: 900, fontSize: 30, letterSpacing: "-0.03em" }}>
                {r(dayTotal.kcal)}
              </span>
              <span style={{ fontSize: 13, opacity: 0.9 }}>kcal</span>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 10, fontFamily: "var(--font-data)", fontSize: 13, fontWeight: 600 }}>
              <span>P {r(dayTotal.p)}g</span>
              <span style={{ opacity: 0.6 }}>·</span>
              <span>C {r(dayTotal.c)}g</span>
              <span style={{ opacity: 0.6 }}>·</span>
              <span>G {r(dayTotal.g)}g</span>
            </div>
          </div>
        </div>

        {/* editor da refeição */}
        {selMeal && (
          <Card style={{ padding: 26 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em" }}>
                {selMeal.name} · {DOW_LABEL[dow]}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  value={selMeal.time}
                  onChange={(e) =>
                    mutate((p) => {
                      p[dow][mealIdx].time = e.target.value;
                    })
                  }
                  style={{ width: 72, height: 34, borderRadius: 8, border: "1px solid var(--color-border-strong)", background: "var(--color-surface)", padding: "0 10px", fontFamily: "var(--font-data)", fontSize: 13, outline: "none", textAlign: "center" }}
                />
                {dayMeals.length > 1 && (
                  <button
                    onClick={() =>
                      mutate((p) => {
                        p[dow].splice(mealIdx, 1);
                        setMealIdx(0);
                      })
                    }
                    title="remover refeição"
                    style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--color-border-strong)", background: "var(--color-surface)", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <IconClose size={15} />
                  </button>
                )}
              </div>
            </div>

            {(() => {
              const tot = macrosOf(selMeal.foods);
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 15, color: "var(--color-orange)" }}>
                    {r(tot.kcal)} kcal
                  </span>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                    P {r(tot.p)}g · C {r(tot.c)}g · G {r(tot.g)}g
                  </span>
                </div>
              );
            })()}

            {/* busca */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="buscar alimento pra adicionar..."
                style={{ height: 44, width: "100%", boxSizing: "border-box", padding: "0 16px", borderRadius: 12, border: "1px solid var(--color-border-strong)", background: "var(--color-surface)", fontSize: 14, outline: "none" }}
              />
              {results.length > 0 && (
                <div style={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 30, background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)", borderRadius: 12, boxShadow: "var(--shadow-elevated)", overflow: "hidden" }}>
                  {results.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => {
                        mutate((p) => {
                          const meal = p[dow][mealIdx];
                          if (!meal.foods.some((x) => x.foodId === f.id))
                            meal.foods.push({ foodId: f.id, qty: f.base });
                        });
                        setQuery("");
                      }}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid var(--color-border)" }}
                    >
                      <span style={{ flex: 1, fontSize: 14 }}>{f.name}</span>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: 12, color: "var(--color-text-muted)" }}>
                        {f.kcal} kcal / {f.base}
                        {f.unit === "un" || f.unit === "fatia" || f.unit === "dose" ? ` ${f.unit}` : f.unit}
                      </span>
                      <span style={{ color: "var(--color-orange)", fontWeight: 700 }}>+</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* alimentos */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {selMeal.foods.length === 0 && (
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "14px 0", textAlign: "center" }}>
                  busca um alimento ali em cima pra começar essa refeição.
                </div>
              )}
              {selMeal.foods.map((e, fi) => {
                const f = foodById.get(e.foodId);
                if (!f) return null;
                const k = e.qty / (f.base || 1);
                return (
                  <div key={e.foodId} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 10, background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                        {r(f.kcal * k)} kcal · P {r(f.p * k)}g · C {r(f.c * k)}g · G {r(f.g * k)}g
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-surface-elevated)", border: "1px solid var(--color-border-strong)", borderRadius: "var(--radius-pill)", padding: 4 }}>
                      <button
                        onClick={() =>
                          mutate((p) => {
                            const entry = p[dow][mealIdx].foods[fi];
                            entry.qty = Math.max(stepFor(f.unit), entry.qty - stepFor(f.unit));
                          })
                        }
                        style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 16, fontWeight: 700 }}
                      >
                        −
                      </button>
                      <span style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 13, minWidth: 52, textAlign: "center" }}>
                        {qtyLabel(e)}
                      </span>
                      <button
                        onClick={() =>
                          mutate((p) => {
                            p[dow][mealIdx].foods[fi].qty += stepFor(f.unit);
                          })
                        }
                        style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 16, fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        mutate((p) => {
                          p[dow][mealIdx].foods.splice(fi, 1);
                        })
                      }
                      style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}
                    >
                      <IconClose size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {error && (
              <div style={{ marginBottom: 12, fontSize: 13, color: "var(--color-error)" }}>{error}</div>
            )}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={handlePublish}
                disabled={busy}
                style={{ height: 46, padding: "0 26px", borderRadius: "var(--radius-pill)", border: "none", background: published ? "var(--color-success)" : "var(--color-orange)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(254,95,51,0.24)" }}
              >
                {busy ? "publicando..." : published ? "publicado ✓" : "publicar pro paciente"}
              </button>
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                publica a semana inteira de uma vez.
              </span>
            </div>
          </Card>
        )}
      </div>

      <style jsx>{`
        .plano-grid { grid-template-columns: 1fr; }
        @media (min-width: 900px) {
          .plano-grid { grid-template-columns: 300px 1fr; }
        }
      `}</style>
    </div>
  );
}
