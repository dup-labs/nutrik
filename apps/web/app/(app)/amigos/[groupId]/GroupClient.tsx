"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, InitialAvatar } from "@/components/ui";
import { IconCheck, IconCopy } from "@/components/ui/icons";
import { TextInput } from "@/components/auth/fields";
import {
  inviteToGroup,
  leaveGroup,
  respondInvite,
  searchProfiles,
} from "@/lib/social/actions";
import type { PendingRequest } from "@/lib/social/queries";
import type { FriendProfile } from "@/lib/types";

const smallBtn = (variant: "solid" | "ghost") =>
  ({
    height: 34,
    padding: "0 16px",
    borderRadius: "var(--radius-pill)",
    border: variant === "solid" ? "none" : "1px solid var(--color-border-strong)",
    background: variant === "solid" ? "var(--color-orange)" : "var(--color-surface)",
    color: variant === "solid" ? "#fff" : "var(--color-text-secondary)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
  }) as const;

/** solicitações de entrada pendentes — só o owner vê */
export function PendingRequestsCard({ requests }: { requests: PendingRequest[] }) {
  const router = useRouter();
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const open = requests.filter((r) => !answered.has(r.id));
  if (open.length === 0) return null;

  async function respond(id: string, accept: boolean) {
    setAnswered((s) => new Set(s).add(id));
    await respondInvite(id, accept);
    router.refresh();
  }

  return (
    <Card style={{ padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
        querem entrar
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {open.map((r) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <InitialAvatar
              initial={(r.requester_name || "?")[0].toUpperCase()}
              mesh="var(--mesh-cool)"
              size={36}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.requester_name.split(" ")[0]}</div>
              {r.requester_username && (
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                  @{r.requester_username}
                </div>
              )}
            </div>
            <button onClick={() => respond(r.id, true)} style={smallBtn("solid")}>
              aprovar
            </button>
            <button onClick={() => respond(r.id, false)} style={smallBtn("ghost")}>
              recusar
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** código + link da turma e convite por username/nome */
export function GroupInviteCard({ groupId, code }: { groupId: string; code: string }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FriendProfile[]>([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [invited, setInvited] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState("");

  function copy(kind: "code" | "link") {
    const text =
      kind === "code" ? code : `${window.location.origin}/amigos/entrar?codigo=${code}`;
    navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleSearch() {
    if (busy || query.trim().length < 3) return;
    setBusy(true);
    setFeedback("");
    const found = await searchProfiles(query);
    setResults(found);
    setSearched(true);
    setBusy(false);
  }

  async function handleInvite(profileId: string) {
    setInvited((s) => new Set(s).add(profileId));
    const result = await inviteToGroup(groupId, profileId);
    if (!result.ok) setFeedback(result.error ?? "algo deu errado.");
  }

  return (
    <Card style={{ padding: 18, marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
        chama mais gente
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 14px",
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            flex: 1,
            fontFamily: "var(--font-data)",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.08em",
          }}
        >
          {code}
        </span>
        <button
          onClick={() => copy("code")}
          style={{ ...smallBtn("ghost"), display: "flex", alignItems: "center", gap: 6 }}
        >
          {copied === "code" ? <IconCheck size={14} /> : <IconCopy size={14} />}
          {copied === "code" ? "copiado" : "código"}
        </button>
        <button
          onClick={() => copy("link")}
          style={{ ...smallBtn("ghost"), display: "flex", alignItems: "center", gap: 6 }}
        >
          {copied === "link" ? <IconCheck size={14} /> : <IconCopy size={14} />}
          {copied === "link" ? "copiado" : "link"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <TextInput
          placeholder="buscar por @username ou nome"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ flex: 1, height: 46 }}
        />
        <button
          onClick={handleSearch}
          disabled={busy || query.trim().length < 3}
          style={{
            ...smallBtn("solid"),
            height: 46,
            opacity: busy || query.trim().length < 3 ? 0.45 : 1,
          }}
        >
          {busy ? "..." : "buscar"}
        </button>
      </div>

      {feedback && (
        <div style={{ fontSize: 13, color: "var(--color-error)", marginTop: 10 }}>{feedback}</div>
      )}

      {searched && results.length === 0 && (
        <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 12 }}>
          ninguém com esse nome por aqui. confere o @username?
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          {results.map((r) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <InitialAvatar
                initial={(r.name || "?")[0].toUpperCase()}
                mesh="var(--mesh-fresh)"
                size={36}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                {r.username && (
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>@{r.username}</div>
                )}
              </div>
              <button
                onClick={() => handleInvite(r.id)}
                disabled={invited.has(r.id)}
                style={{ ...smallBtn("solid"), opacity: invited.has(r.id) ? 0.45 : 1 }}
              >
                {invited.has(r.id) ? "convidado" : "convidar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/** sair da turma (membro não-owner) */
export function LeaveGroupButton({ groupId }: { groupId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <div style={{ textAlign: "center" }}>
      {confirming ? (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            onClick={async () => {
              setBusy(true);
              await leaveGroup(groupId);
            }}
            disabled={busy}
            style={{
              ...smallBtn("ghost"),
              color: "var(--color-error)",
              borderColor: "rgba(239,68,68,0.4)",
            }}
          >
            {busy ? "saindo..." : "confirmar saída"}
          </button>
          <button onClick={() => setConfirming(false)} style={smallBtn("ghost")}>
            cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "var(--color-text-muted)",
            textDecoration: "underline",
          }}
        >
          sair da turma
        </button>
      )}
    </div>
  );
}
