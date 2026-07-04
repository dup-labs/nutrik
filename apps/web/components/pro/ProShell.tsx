"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InitialAvatar } from "@/components/ui";
import {
  IconCalendar,
  IconChat,
  IconGrid,
  IconClipboardCheck,
  IconUser,
} from "@/components/ui/icons";
import { PRO_ACCENT, type ProfessionalType } from "@/lib/types";

const NAV = [
  { href: "/pro", label: "dashboard", icon: IconGrid, exact: true },
  { href: "/pro/pacientes", label: "pacientes", icon: IconUser },
  { href: "/pro/agenda", label: "agenda", icon: IconCalendar },
  { href: "/pro/mensagens", label: "mensagens", icon: IconChat },
  { href: "/pro/checkins", label: "check-ins", icon: IconClipboardCheck },
];

export function ProShell({
  proName,
  proType,
  patientCount,
  children,
}: {
  proName: string;
  proType: ProfessionalType;
  patientCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const acc = PRO_ACCENT[proType];
  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--gradient-canvas)",
        display: "flex",
      }}
    >
      {/* sidebar desktop */}
      <aside
        className="pro-sidebar"
        style={{
          width: 240,
          flexShrink: 0,
          borderRight: "1px solid var(--color-border)",
          padding: "28px 16px",
          position: "sticky",
          top: 0,
          height: "100dvh",
          flexDirection: "column",
          gap: 4,
          background: "var(--glass-bg)",
          backdropFilter: "var(--glass-blur)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 26,
            letterSpacing: "-0.03em",
            padding: "0 14px",
            marginBottom: 4,
          }}
        >
          Nūtrk
        </div>
        <div
          style={{
            fontSize: 12,
            color: acc.accent,
            padding: "0 14px",
            marginBottom: 20,
          }}
        >
          painel · {PRO_ACCENT[proType].role}
        </div>

        {NAV.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: active ? 600 : 500,
                color: active ? "var(--color-orange)" : "var(--color-text-secondary)",
                background: active ? "var(--color-orange-subtle)" : "transparent",
                textDecoration: "none",
                transition: "all .15s",
              }}
            >
              <Icon size={19} />
              {item.label}
              {item.href === "/pro/pacientes" && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-data)",
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                  }}
                >
                  {patientCount}
                </span>
              )}
            </Link>
          );
        })}

        <Link
          href="/pro/perfil"
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 12,
            textDecoration: "none",
            background: pathname.startsWith("/pro/perfil")
              ? "var(--color-orange-subtle)"
              : "transparent",
          }}
        >
          <InitialAvatar
            initial={proName.replace(/^Dra?\. /, "")[0]}
            mesh={acc.mesh}
            size={36}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {proName}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>ver perfil</div>
          </div>
        </Link>
      </aside>

      {/* conteúdo */}
      <main style={{ flex: 1, minWidth: 0, paddingBottom: 90 }}>{children}</main>

      {/* bottom nav mobile */}
      <nav
        className="pro-bottomnav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "calc(64px + env(safe-area-inset-bottom))",
          paddingBottom: "env(safe-area-inset-bottom)",
          background: "var(--glass-bg-strong)",
          backdropFilter: "var(--glass-blur)",
          borderTop: "1px solid var(--color-border)",
          alignItems: "flex-start",
          justifyContent: "space-around",
          paddingTop: 8,
          zIndex: 50,
        }}
      >
        {[...NAV, { href: "/pro/perfil", label: "perfil", icon: IconUser, exact: false }].map(
          (item) => {
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
                  gap: 3,
                  flex: 1,
                  color: active ? "var(--color-orange)" : "var(--color-text-muted)",
                  textDecoration: "none",
                }}
              >
                <Icon size={22} />
                <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
              </Link>
            );
          },
        )}
      </nav>

      <style jsx global>{`
        .pro-sidebar { display: none; }
        .pro-bottomnav { display: flex; }
        @media (min-width: 1024px) {
          .pro-sidebar { display: flex !important; }
          .pro-bottomnav { display: none !important; }
        }
      `}</style>
    </div>
  );
}
