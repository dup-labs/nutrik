import { AppCard, Badge, BackHeader, C, Ico, MacroRow, Screen } from "./appkit";

const disp = "var(--font-display)";

const week = [
  { d: "seg", n: 7 },
  { d: "ter", n: 8 },
  { d: "qua", n: 9 },
  { d: "qui", n: 10, today: true },
  { d: "sex", n: 11 },
  { d: "sáb", n: 12 },
  { d: "dom", n: 13 },
];

const meals = [
  {
    time: "08:00",
    name: "Café da manhã",
    status: "done" as const,
    desc: "Ovos mexidos, pão integral e mamão.",
    macros: { kcal: 420, p: 28, c: 44, g: 14 },
  },
  {
    time: "12:30",
    name: "Almoço",
    status: "pending" as const,
    desc: "Frango grelhado, arroz, feijão e salada.",
    macros: { kcal: 620, p: 45, c: 62, g: 18 },
  },
];

export default function RefeicoesScreen() {
  return (
    <Screen active="hoje">
      <BackHeader title="refeições de hoje" subtitle="o convite é comer bem, no seu tempo." />

      {/* seletor da semana */}
      <div style={{ display: "flex", gap: 5, marginBottom: 13 }}>
        {week.map((day) => {
          const sel = !!day.today;
          return (
            <div key={day.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: sel ? C.orange : C.muted }}>{day.d}</span>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: disp,
                  fontWeight: 700,
                  fontSize: 12.5,
                  background: sel ? C.orange : C.surface,
                  color: sel ? "#fff" : day.n > 10 ? C.disabled : C.ink,
                  border: sel ? "none" : `1px solid ${C.border}`,
                }}
              >
                {day.n}
              </div>
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: day.n < 10 ? C.green : sel ? C.orange : "transparent",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* refeições */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {meals.map((m) => (
          <AppCard key={m.time} style={{ opacity: m.status === "done" ? 0.74 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ fontFamily: disp, fontWeight: 700, fontSize: 11.5, color: C.muted }}>{m.time}</span>
                <span style={{ fontFamily: disp, fontWeight: 700, fontSize: 14.5, letterSpacing: "-0.02em" }}>{m.name}</span>
              </div>
              <Badge tone={m.status === "done" ? "success" : "warm"}>{m.status === "done" ? "feito" : "pendente"}</Badge>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.5, color: C.ink2 }}>{m.desc}</div>
            <div style={{ marginTop: 9 }}>
              <MacroRow kcal={m.macros.kcal} p={m.macros.p} c={m.macros.c} g={m.macros.g} />
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.orange }}>
                {m.status === "done" ? "ver registro" : "registrar"}
              </span>
              <Ico name="chevron-right" size={16} color={C.orange} />
            </div>
          </AppCard>
        ))}
      </div>
    </Screen>
  );
}
