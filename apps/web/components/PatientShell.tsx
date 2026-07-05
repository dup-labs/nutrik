"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNav, NAV_ITEMS } from "@/components/BottomNav";

export function PatientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (item: (typeof NAV_ITEMS)[number]) =>
    item.match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));

  return (
    <div style={{ minHeight: "100dvh", background: "var(--gradient-canvas)", display: "flex" }}>
      {/* trilho lateral — só desktop */}
      <aside
        className="pac-sidebar"
        style={{
          width: 220,
          flexShrink: 0,
          borderRight: "1px solid var(--color-border)",
          padding: "28px 14px",
          position: "sticky",
          top: 0,
          height: "100dvh",
          flexDirection: "column",
          gap: 4,
          background: "var(--glass-bg)",
          backdropFilter: "var(--glass-blur)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 26,
            letterSpacing: "-0.03em",
            color: "var(--color-text)",
            textDecoration: "none",
            padding: "0 14px",
            marginBottom: 24,
          }}
        >
          Nūtrk
        </Link>
        {NAV_ITEMS.map((item) => {
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
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </aside>

      <main style={{ flex: 1, minWidth: 0, paddingBottom: 96 }}>{children}</main>

      <BottomNav />
    </div>
  );
}
