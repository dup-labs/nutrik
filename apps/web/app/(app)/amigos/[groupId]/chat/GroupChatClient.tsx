"use client";

// Chat da turma — sem realtime por enquanto: envio otimista + botão de
// atualizar no header (novidades também chegam pelas notificações).

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { InitialAvatar } from "@/components/ui";
import { IconChevronLeft, IconRefresh, IconSend } from "@/components/ui/icons";
import { relativeLabel } from "@/lib/dates";
import { sendGroupMessage } from "@/lib/social/actions";
import type { FriendGroup, GroupMessage } from "@/lib/types";

const MESHES = ["var(--mesh-warm)", "var(--mesh-cool)", "var(--mesh-fresh)", "var(--mesh-mist)"];

function meshFor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 997;
  return MESHES[h % MESHES.length];
}

export function GroupChatClient({
  group,
  initialMessages,
  senders,
  userId,
}: {
  group: FriendGroup;
  initialMessages: GroupMessage[];
  senders: Record<string, { name: string; username: string | null }>;
  userId: string;
}) {
  const router = useRouter();
  const [extra, setExtra] = useState<GroupMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [refreshing, startRefresh] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => {
    const known = new Set(initialMessages.map((m) => m.id));
    return [...initialMessages, ...extra.filter((m) => !known.has(m.id))];
  }, [initialMessages, extra]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend() {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    const tmpId = `tmp-${Date.now()}`;
    const optimistic: GroupMessage = {
      id: tmpId,
      group_id: group.id,
      sender_id: userId,
      body,
      created_at: new Date().toISOString(),
    };
    setExtra((e) => [...e, optimistic]);
    const result = await sendGroupMessage(group.id, body);
    if (result.ok && result.message) {
      setExtra((e) => e.map((m) => (m.id === tmpId ? result.message! : m)));
    }
  }

  function senderLabel(id: string) {
    const s = senders[id];
    if (!s) return "alguém";
    return s.username ? `@${s.username}` : s.name.split(" ")[0];
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "var(--gradient-canvas)",
        display: "flex",
        flexDirection: "column",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 18px 10px",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--glass-bg-strong)",
          backdropFilter: "var(--glass-blur)",
        }}
      >
        <Link
          href={`/amigos/${group.id}`}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-elevated)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--color-text)",
          }}
        >
          <IconChevronLeft size={17} />
        </Link>
        <InitialAvatar initial={group.name[0].toUpperCase()} mesh="var(--mesh-warm)" size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{group.name}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>chat da turma</div>
        </div>
        <button
          onClick={() => startRefresh(() => router.refresh())}
          aria-label="atualizar mensagens"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-elevated)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            flexShrink: 0,
            opacity: refreshing ? 0.5 : 1,
          }}
        >
          <IconRefresh size={17} />
        </button>
      </div>

      <div
        className="ntrk-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "var(--color-text-muted)",
              marginTop: 24,
            }}
          >
            começa a resenha. a turma toda vê por aqui.
          </div>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === userId;
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                gap: 8,
                flexDirection: mine ? "row-reverse" : "row",
                alignItems: "flex-end",
              }}
            >
              {!mine && (
                <InitialAvatar
                  initial={(senders[m.sender_id]?.name ?? "?")[0].toUpperCase()}
                  mesh={meshFor(m.sender_id)}
                  size={28}
                />
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: mine ? "flex-end" : "flex-start",
                  maxWidth: "78%",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: mine ? "rgba(254,175,76,0.20)" : "var(--color-surface)",
                    border: mine
                      ? "1px solid rgba(254,175,76,0.45)"
                      : "1px solid var(--color-border)",
                  }}
                >
                  {!mine && (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#c67518",
                        marginBottom: 3,
                      }}
                    >
                      {senderLabel(m.sender_id)}
                    </div>
                  )}
                  <div style={{ fontSize: 14, lineHeight: 1.45 }}>{m.body}</div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 10,
                    color: "var(--color-text-muted)",
                    marginTop: 4,
                    padding: "0 4px",
                  }}
                >
                  {relativeLabel(m.created_at)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px calc(16px + env(safe-area-inset-bottom))",
          borderTop: "1px solid var(--color-border)",
          background: "var(--glass-bg-strong)",
          backdropFilter: "var(--glass-blur)",
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="escreve pra turma..."
          style={{
            flex: 1,
            height: 46,
            padding: "0 18px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--color-border-strong)",
            background: "var(--color-surface-elevated)",
            fontSize: 14,
            color: "var(--color-text)",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "none",
            background: "var(--color-orange)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(254,95,51,0.24)",
            color: "#fff",
          }}
        >
          <IconSend size={19} />
        </button>
      </div>
    </div>
  );
}
