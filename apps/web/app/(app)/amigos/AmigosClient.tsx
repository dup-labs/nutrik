"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, MeshAura, PrimaryButton, Switch } from "@/components/ui";
import { IconChevronRight, IconTrophy, IconUsers } from "@/components/ui/icons";
import { TextInput } from "@/components/auth/fields";
import { setUsername } from "@/lib/actions";
import { createGroup, joinGroupWithCode, respondInvite } from "@/lib/social/actions";
import type { PendingInvite } from "@/lib/social/queries";

type GroupCard = {
  id: string;
  name: string;
  memberCount: number;
  myWeekPoints: number;
  myPosition: number;
};

export function AmigosClient({
  groups,
  invites,
  hasUsername,
}: {
  groups: GroupCard[];
  invites: PendingInvite[];
  hasUsername: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"criar" | "entrar" | null>(null);
  const [nome, setNome] = useState("");
  const [aprovacao, setAprovacao] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [uname, setUname] = useState("");
  const [unameError, setUnameError] = useState("");
  const [unameBusy, setUnameBusy] = useState(false);

  async function handleUsername() {
    const value = uname.trim();
    if (unameBusy || value.length < 3) return;
    setUnameBusy(true);
    setUnameError("");
    const result = await setUsername(value);
    setUnameBusy(false);
    if (!result.ok) {
      setUnameError(result.error ?? "não conseguimos salvar agora.");
      return;
    }
    router.refresh();
  }

  async function handleCreate() {
    if (busy || nome.trim().length < 2) return;
    setBusy(true);
    setError("");
    const result = await createGroup({
      name: nome,
      joinPolicy: aprovacao ? "approval" : "open",
    });
    setBusy(false);
    if (!result.ok || !result.groupId) {
      setError(result.error ?? "algo deu errado.");
      return;
    }
    router.push(`/amigos/${result.groupId}`);
  }

  async function handleJoin() {
    if (busy || codigo.trim().length < 4) return;
    setBusy(true);
    setError("");
    setInfo("");
    const result = await joinGroupWithCode(codigo);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "algo deu errado.");
      return;
    }
    if (result.status === "requested") {
      setInfo(`pedido enviado. quem cuida da "${result.name}" precisa aprovar sua entrada.`);
      setCodigo("");
      return;
    }
    router.push(`/amigos/${result.groupId}`);
  }

  async function handleInvite(id: string, accept: boolean) {
    setAnswered((s) => new Set(s).add(id));
    const result = await respondInvite(id, accept);
    if (result.ok && accept && result.groupId) {
      router.push(`/amigos/${result.groupId}`);
      return;
    }
    router.refresh();
  }

  const pill = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={() => hasUsername && onClick()}
      disabled={!hasUsername}
      title={hasUsername ? undefined : "escolhe seu username primeiro"}
      style={{
        height: 40,
        padding: "0 18px",
        borderRadius: "var(--radius-pill)",
        border: active ? "none" : "1px solid var(--color-border-strong)",
        background: active ? "var(--color-orange)" : "var(--color-surface-elevated)",
        color: active ? "#fff" : "var(--color-text-secondary)",
        fontSize: 14,
        fontWeight: 600,
        cursor: hasUsername ? "pointer" : "default",
        opacity: hasUsername ? 1 : 0.45,
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      {!hasUsername && (
        <Card style={{ padding: 18, marginBottom: 14, border: "1.5px solid var(--color-orange-dim)" }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>escolhe seu username</div>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2, marginBottom: 12 }}>
            é ele que te identifica no ranking e no chat — precisa dele pra
            criar ou entrar numa turma.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <TextInput
              placeholder="ex: brunodup"
              value={uname}
              onChange={(e) => setUname(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleUsername()}
              style={{ flex: 1, height: 46 }}
            />
            <button
              onClick={handleUsername}
              disabled={unameBusy || uname.trim().length < 3}
              style={{
                height: 46,
                padding: "0 20px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                background: "var(--color-orange)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                opacity: unameBusy || uname.trim().length < 3 ? 0.45 : 1,
                flexShrink: 0,
              }}
            >
              {unameBusy ? "..." : "salvar"}
            </button>
          </div>
          {unameError && (
            <div style={{ fontSize: 13, color: "var(--color-error)", marginTop: 10 }}>
              {unameError}
            </div>
          )}
        </Card>
      )}

      {/* convites pendentes */}
      {invites.filter((i) => !answered.has(i.id)).length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
            convites
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {invites
              .filter((i) => !answered.has(i.id))
              .map((inv) => (
                <Card key={inv.id} style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 14, color: "var(--color-text)" }}>
                    <strong>{inv.inviter_name ?? "alguém"}</strong> te chamou pra turma{" "}
                    <strong>&quot;{inv.group_name}&quot;</strong>.
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
                    <button
                      onClick={() => hasUsername && handleInvite(inv.id, true)}
                      disabled={!hasUsername}
                      title={hasUsername ? undefined : "escolhe seu username primeiro"}
                      style={{
                        height: 36,
                        padding: "0 18px",
                        borderRadius: "var(--radius-pill)",
                        border: "none",
                        background: "var(--color-orange)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: hasUsername ? "pointer" : "default",
                        opacity: hasUsername ? 1 : 0.45,
                      }}
                    >
                      entrar
                    </button>
                    <button
                      onClick={() => handleInvite(inv.id, false)}
                      style={{
                        height: 36,
                        padding: "0 18px",
                        borderRadius: "var(--radius-pill)",
                        border: "1px solid var(--color-border-strong)",
                        background: "var(--color-surface)",
                        color: "var(--color-text-secondary)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      agora não
                    </button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* minhas turmas */}
      {groups.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {groups.map((g) => (
            <Link key={g.id} href={`/amigos/${g.id}`} style={{ textDecoration: "none" }}>
              <Card
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                }}
              >
                <MeshAura mesh="warm" size={90} blur={20} opacity={0.4} style={{ top: -30, right: -25 }} />
                <div
                  style={{
                    position: "relative",
                    width: 46,
                    height: 46,
                    borderRadius: "var(--radius-md)",
                    background: "rgba(254,175,76,0.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconTrophy size={22} color="#c67518" />
                </div>
                <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 17,
                      letterSpacing: "-0.02em",
                      color: "var(--color-text)",
                    }}
                  >
                    {g.name}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
                    {g.memberCount} {g.memberCount === 1 ? "pessoa" : "pessoas"} · você em{" "}
                    {g.myPosition}º com {g.myWeekPoints} pts na semana
                  </div>
                </div>
                <IconChevronRight size={18} color="var(--color-text-muted)" />
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* empty state */}
      {groups.length === 0 && (
        <Card style={{ padding: "28px 22px", textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto",
              borderRadius: "50%",
              background: "var(--mesh-warm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconUsers size={28} color="#fff" />
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: "-0.02em",
              marginTop: 16,
            }}
          >
            monta sua turma.
          </div>
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.5,
              color: "var(--color-text-secondary)",
              marginTop: 8,
              maxWidth: 280,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            cada dia batido vale ponto: dieta, treino, água, meditação e sono.
            chama os amigos e vê quem aparece mais.
          </div>
        </Card>
      )}

      {/* ações */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {pill("criar turma", mode === "criar", () => {
          setMode(mode === "criar" ? null : "criar");
          setError("");
          setInfo("");
        })}
        {pill("entrar com código", mode === "entrar", () => {
          setMode(mode === "entrar" ? null : "entrar");
          setError("");
          setInfo("");
        })}
      </div>

      {error && (
        <div style={{ fontSize: 13, color: "var(--color-error)", marginBottom: 12 }}>{error}</div>
      )}
      {info && (
        <div
          style={{
            marginBottom: 12,
            background: "rgba(47,158,107,0.10)",
            border: "1px solid rgba(47,158,107,0.24)",
            borderRadius: "var(--radius-md)",
            padding: 14,
            fontSize: 14,
            color: "#2f9e6b",
            fontWeight: 500,
          }}
        >
          {info}
        </div>
      )}

      {mode === "criar" && (
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
            nome da turma
          </div>
          <TextInput
            placeholder="ex: os do rack"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ marginBottom: 14 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>aprovar quem entra</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                {aprovacao
                  ? "quem usar o código espera seu ok."
                  : "turma aberta: quem tiver o código entra direto."}
              </div>
            </div>
            <Switch checked={aprovacao} onChange={setAprovacao} label="aprovar quem entra" />
          </div>
          <PrimaryButton disabled={busy || nome.trim().length < 2} onClick={handleCreate}>
            {busy ? "criando..." : "criar turma"}
          </PrimaryButton>
        </Card>
      )}

      {mode === "entrar" && (
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
            código da turma
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <TextInput
              placeholder="NUTRK-XXXX"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              style={{ fontFamily: "var(--font-data)", letterSpacing: "0.06em", flex: 1 }}
            />
            <button
              onClick={handleJoin}
              disabled={busy || codigo.trim().length < 4}
              style={{
                height: 52,
                padding: "0 20px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                background: "var(--color-orange)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                opacity: busy || codigo.trim().length < 4 ? 0.45 : 1,
                flexShrink: 0,
              }}
            >
              {busy ? "..." : "entrar"}
            </button>
          </div>
        </Card>
      )}
    </>
  );
}
