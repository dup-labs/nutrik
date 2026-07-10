import { Avatar, BackHeader, C, Ico, Screen, type MeshKey } from "./appkit";

const disp = "var(--font-display)";

// pilares que ESTA turma pontua (config de métricas por turma)
const DOTS: Record<string, string> = { dieta: "#c67518", treino: "#fe5f33", agua: "#2b93a8", mente: "#5a63c4" };

const entries: {
  name: string;
  user: string;
  pts: number;
  mesh: MeshKey;
  today: string[];
  me?: boolean;
}[] = [
  { name: "Lari", user: "larimoves", pts: 24, mesh: "cool", today: ["dieta", "treino", "agua", "mente"] },
  { name: "Bruno", user: "brunodup", pts: 21, mesh: "warm", today: ["dieta", "treino", "agua"], me: true },
  { name: "Rafa", user: "rafacm", pts: 18, mesh: "fresh", today: ["treino", "agua"] },
  { name: "Duda", user: "duda.fit", pts: 15, mesh: "mist", today: ["dieta"] },
];

const iconBtn = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: `1px solid ${C.border}`,
  background: C.card,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: C.ink2,
} as const;

export default function RankingScreen() {
  return (
    <Screen active="amigos">
      <BackHeader
        title="turma da firma"
        subtitle="6 pessoas · turma aberta"
        right={
          <div style={{ display: "flex", gap: 6 }}>
            <div style={iconBtn}>
              <Ico name="chat" size={15} />
            </div>
            <div style={iconBtn}>
              <Ico name="gear" size={15} />
            </div>
          </div>
        }
      />

      {/* período */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["semana", "geral"].map((t) => {
          const on = t === "semana";
          return (
            <div
              key={t}
              style={{
                height: 28,
                padding: "0 14px",
                borderRadius: 40,
                border: on ? "none" : `1px solid ${C.borderStrong}`,
                background: on ? C.orange : C.card,
                color: on ? "#fff" : C.ink2,
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              {t}
            </div>
          );
        })}
      </div>

      {/* ranking */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
        {entries.map((e, i) => (
          <div
            key={e.user}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 14,
              background: e.me ? C.orangeSubtle : C.card,
              border: e.me ? `1.5px solid ${C.orangeDim}` : `1px solid ${C.border}`,
              boxShadow: "0 2px 8px rgba(27,28,29,0.05)",
            }}
          >
            <span
              style={{
                fontFamily: disp,
                fontWeight: 700,
                fontSize: 13,
                color: i === 0 ? C.orange : C.muted,
                width: 20,
                flexShrink: 0,
              }}
            >
              {i + 1}º
            </span>
            <Avatar initial={e.name[0]} mesh={e.mesh} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: disp, fontWeight: 700, fontSize: 14 }}>
                {e.name}
                {e.me && <span style={{ fontWeight: 500, color: C.muted }}> · você</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ fontSize: 10.5, color: C.muted }}>@{e.user}</span>
                {e.today.map((k) => (
                  <span key={k} style={{ width: 6, height: 6, borderRadius: "50%", background: DOTS[k], flexShrink: 0 }} />
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ fontFamily: disp, fontWeight: 900, fontSize: 16, letterSpacing: "-0.02em" }}>{e.pts}</span>
              <span style={{ fontSize: 10, color: C.muted, marginLeft: 2 }}>pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* legenda */}
      <div style={{ padding: "10px 13px", borderRadius: 14, background: C.card, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.55 }}>
          cada dia vale até 4 pontos nesta turma: dieta, treino, água, mente.
        </div>
      </div>
    </Screen>
  );
}
