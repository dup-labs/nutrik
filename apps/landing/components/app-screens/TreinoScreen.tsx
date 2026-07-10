import { AppCard, BackHeader, C, MeshAura, Screen, Tag } from "./appkit";

const disp = "var(--font-display)";

const exercises = [
  { name: "Supino reto", sets: "4 × 8–10", load: "40 kg", done: 4 },
  { name: "Desenvolvimento halteres", sets: "4 × 10–12", load: "14 kg", done: 2 },
  { name: "Crucifixo na polia", sets: "3 × 12–15", load: "12 kg", done: 0 },
];

export default function TreinoScreen() {
  return (
    <Screen active="hoje">
      <BackHeader title="treino de hoje" subtitle="movimento como prazer, não obrigação." />

      {/* dia de treino */}
      <AppCard style={{ position: "relative", overflow: "hidden", padding: 15, marginBottom: 12 }}>
        <MeshAura mesh="warm" size={100} blur={22} opacity={0.5} style={{ top: -34, right: -26 }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: disp, fontWeight: 900, fontSize: 18, letterSpacing: "-0.02em" }}>Superior A · push</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <Tag tone="warm">~50 min</Tag>
            <Tag>5 exercícios</Tag>
          </div>
        </div>
      </AppCard>

      {/* exercícios */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {exercises.map((e) => (
          <AppCard key={e.name} style={{ padding: "12px 13px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: disp,
                    fontWeight: 700,
                    fontSize: 13.5,
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {e.name}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{e.sets}</div>
              </div>
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: disp,
                  fontWeight: 700,
                  fontSize: 11.5,
                  color: C.ink2,
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 40,
                  padding: "4px 10px",
                }}
              >
                {e.load}
              </span>
            </div>
            {/* séries */}
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              {[0, 1, 2, 3].map((s) => {
                const done = s < e.done;
                return (
                  <div
                    key={s}
                    style={{
                      flex: 1,
                      height: 24,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: done ? "rgba(47,158,107,0.12)" : C.surface,
                      border: done ? "1px solid rgba(47,158,107,0.28)" : `1px solid ${C.border}`,
                    }}
                  >
                    {done ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.disabled, fontFamily: disp }}>{s + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </AppCard>
        ))}
      </div>
    </Screen>
  );
}
