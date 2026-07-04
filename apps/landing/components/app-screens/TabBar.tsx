import Icon from "@/components/ui/Icon";

const TABS = [
  { id: "home",   icon: "home" },
  { id: "treino", icon: "dumbbell" },
  { id: "nutri",  icon: "leaf" },
  { id: "mente",  icon: "mind" },
  { id: "perfil", icon: "user" },
];

export default function TabBar({ active = "home" }: { active?: string }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 62, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(24,25,29,0.07)", display: "flex", alignItems: "center", justifyContent: "space-around", paddingBottom: 6 }}>
      {TABS.map(t => (
        <div key={t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <Icon name={t.icon} size={21} color={active === t.id ? "#FE5F33" : "rgba(24,25,29,0.32)"} strokeWidth={active === t.id ? 2.2 : 1.9} />
          {active === t.id && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FE5F33" }} />}
        </div>
      ))}
    </div>
  );
}
