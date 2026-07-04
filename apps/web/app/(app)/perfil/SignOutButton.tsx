"use client";

import { IconLogout } from "@/components/ui/icons";
import { signOut } from "@/lib/actions";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      style={{
        width: "100%",
        height: 50,
        borderRadius: "var(--radius-pill)",
        border: "1px solid rgba(239,68,68,0.25)",
        background: "rgba(239,68,68,0.06)",
        color: "#ef4444",
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <IconLogout size={17} /> sair da conta
    </button>
  );
}
