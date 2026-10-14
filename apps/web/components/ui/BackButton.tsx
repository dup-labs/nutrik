"use client";

import { useRouter } from "next/navigation";
import { IconChevronLeft } from "./icons";

/**
 * Seta de voltar pra páginas abertas de vários lugares (legais, excluir conta).
 * Volta pra tela anterior; sem histórico (link externo, app aberto direto
 * nela) vai pro fallback. No app nativo não existe botão voltar do navegador,
 * então essas páginas precisam do próprio.
 */
export function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="voltar"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push(fallback);
      }}
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface-elevated)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "var(--color-text)",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <IconChevronLeft size={18} />
    </button>
  );
}
