"use client";

// Deep link de convite: /amigos/entrar?codigo=NUTRK-XXXX
// tenta entrar na turma assim que abre; turma com aprovação vira pedido.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BackHeader, Card } from "@/components/ui";
import { joinGroupWithCode } from "@/lib/social/actions";

type State =
  | { kind: "joining" }
  | { kind: "requested"; name: string }
  | { kind: "error"; message: string };

export function EntrarClient({ codigo }: { codigo: string }) {
  const router = useRouter();
  const ran = useRef(false);
  const [state, setState] = useState<State>(
    codigo
      ? { kind: "joining" }
      : { kind: "error", message: "link sem código. pede pra turma mandar de novo?" },
  );

  useEffect(() => {
    if (!codigo || ran.current) return;
    ran.current = true;
    joinGroupWithCode(codigo).then((result) => {
      if (!result.ok) {
        setState({ kind: "error", message: result.error ?? "algo deu errado." });
        return;
      }
      if (result.status === "requested") {
        setState({ kind: "requested", name: result.name ?? "turma" });
        return;
      }
      router.replace(`/amigos/${result.groupId}`);
    });
  }, [codigo, router]);

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 560, margin: "0 auto" }}>
      <BackHeader href="/amigos" title="entrar na turma" />
      <Card style={{ padding: "28px 22px", textAlign: "center" }}>
        {state.kind === "joining" && (
          <div style={{ fontSize: 15, color: "var(--color-text-secondary)" }}>
            entrando na turma...
          </div>
        )}
        {state.kind === "requested" && (
          <>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
              pedido enviado.
            </div>
            <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 8, lineHeight: 1.5 }}>
              quem cuida da &quot;{state.name}&quot; precisa aprovar sua entrada.
              a gente te avisa nas novidades.
            </div>
            <Link
              href="/amigos"
              style={{ display: "inline-block", marginTop: 16, fontSize: 14, fontWeight: 600, color: "var(--color-orange)" }}
            >
              voltar pros amigos
            </Link>
          </>
        )}
        {state.kind === "error" && (
          <>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
              não rolou.
            </div>
            <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 8 }}>
              {state.message}
            </div>
            <Link
              href="/amigos"
              style={{ display: "inline-block", marginTop: 16, fontSize: 14, fontWeight: 600, color: "var(--color-orange)" }}
            >
              voltar pros amigos
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}
