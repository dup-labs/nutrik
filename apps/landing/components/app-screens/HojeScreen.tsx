import { AppCard, Avatar, C, Ico, MeshAura, Screen, type MeshKey } from "./appkit";

const disp = "var(--font-display)";

const worlds: {
  title: string;
  sub: string;
  mesh: MeshKey;
  iconBg: string;
  icon: "fork" | "dumbbell" | "drop" | "brain";
  iconColor: string;
}[] = [
  { title: "nutrição", sub: "3/5 hoje", mesh: "warm", iconBg: "rgba(254,175,76,0.16)", icon: "fork", iconColor: "#c67518" },
  { title: "treino", sub: "superior A", mesh: "warm", iconBg: "rgba(254,95,51,0.08)", icon: "dumbbell", iconColor: "#fe5f33" },
  { title: "água", sub: "1,4/2 l", mesh: "mist", iconBg: "rgba(173,243,243,0.28)", icon: "drop", iconColor: "#2b93a8" },
  { title: "mente", sub: "respirar · humor", mesh: "fresh", iconBg: "rgba(173,183,247,0.24)", icon: "brain", iconColor: "#5a63c4" },
];

export default function HojeScreen() {
  return (
    <Screen active="hoje">
      {/* saudação */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11.5, color: C.muted }}>quinta, 10 jul</div>
          <div style={{ fontFamily: disp, fontWeight: 900, fontSize: 20, letterSpacing: "-0.03em", marginTop: 1, whiteSpace: "nowrap" }}>
            oi, Bruno.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              position: "relative",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid ${C.border}`,
              background: C.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.ink2,
            }}
          >
            <Ico name="bell" size={16} />
            <span
              style={{
                position: "absolute",
                top: 5,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: C.orange,
                border: "1.5px solid #fff",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(254,175,76,0.16)",
              border: "1px solid rgba(254,175,76,0.32)",
              borderRadius: 40,
              height: 32,
              padding: "0 12px",
            }}
          >
            <Ico name="flame" size={14} color="#fe5f33" />
            <span style={{ fontFamily: disp, fontWeight: 700, fontSize: 14, color: "#c67518" }}>12</span>
          </div>
        </div>
      </div>

      {/* seu dia */}
      <AppCard style={{ padding: 13, marginBottom: 11 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink2 }}>seu dia</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontFamily: disp, fontWeight: 700, fontSize: 13, color: C.orange }}>72%</span>
            <Ico name="chevron-right" size={14} color={C.muted} />
          </div>
        </div>
        <div style={{ marginTop: 10, height: 9, borderRadius: 99, background: C.orangeSubtle, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 99, width: "72%", background: "linear-gradient(90deg,#fe5f33,#feaf4c)" }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 11.5, color: C.muted }}>você tá indo bem. falta pouco.</div>
      </AppCard>

      {/* os 4 mundos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        {worlds.map((w) => (
          <div
            key={w.title}
            style={{
              position: "relative",
              overflow: "hidden",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 12,
              boxShadow: "0 4px 24px rgba(27,28,29,0.06)",
              minHeight: 90,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <MeshAura mesh={w.mesh} size={70} blur={16} opacity={0.5} style={{ top: -24, right: -24 }} />
            <div
              style={{
                position: "relative",
                width: 38,
                height: 38,
                borderRadius: 10,
                background: w.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ico name={w.icon} size={20} color={w.iconColor} />
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: disp, fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>{w.title}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{w.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
