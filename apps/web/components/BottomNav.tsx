"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBrain, IconChart, IconHome, IconUser, IconUsers } from "@/components/ui/icons";

export const NAV_ITEMS = [
  { href: "/", label: "hoje", icon: IconHome, match: ["/", "/refeicoes", "/treino", "/treinos", "/agua", "/exercicio", "/dia"] },
  { href: "/mente", label: "mente", icon: IconBrain, match: ["/mente"] },
  { href: "/progresso", label: "progresso", icon: IconChart, match: ["/progresso"] },
  { href: "/amigos", label: "amigos", icon: IconUsers, match: ["/amigos"] },
  { href: "/perfil", label: "perfil", icon: IconUser, match: ["/perfil", "/consultas", "/notificacoes", "/chat"] },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (item: (typeof NAV_ITEMS)[number]) =>
    item.match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));

  return (
    <nav
      className="pac-bottomnav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "calc(66px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "var(--glass-bg-strong)",
        backdropFilter: "var(--glass-blur)",
        WebkitBackdropFilter: "var(--glass-blur)",
        borderTop: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        paddingTop: 10,
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              flex: 1,
              color: active ? "var(--color-orange)" : "var(--color-text-muted)",
              textDecoration: "none",
            }}
          >
            <Icon size={24} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
