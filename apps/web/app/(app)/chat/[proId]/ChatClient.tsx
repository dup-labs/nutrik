"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { InitialAvatar } from "@/components/ui";
import { IconChevronLeft, IconSend } from "@/components/ui/icons";
import { sendMessage } from "@/lib/actions";
import { relativeLabel } from "@/lib/dates";
import { createClient } from "@/lib/supabase/client";
import { PRO_ACCENT, type Message, type Professional } from "@/lib/types";

export function ChatClient({
  pro,
  initialMessages,
  userId,
}: {
  pro: Professional;
  initialMessages: Message[];
  userId: string;
}) {
  const acc = PRO_ACCENT[pro.type];
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // mensagens novas do profissional em tempo real
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`chat-${pro.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "nutrk",
          table: "messages",
          filter: `patient_id=eq.${userId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          if (msg.professional_id !== pro.id) return;
          setMessages((m) =>
            m.some((x) => x.id === msg.id) ? m : [...m, msg],
          );
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [pro.id, userId]);

  function handleSend() {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    const optimistic: Message = {
      id: `tmp-${Date.now()}`,
      patient_id: userId,
      professional_id: pro.id,
      sender: "patient",
      body,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages((m) => [...m, optimistic]);
    sendMessage({ professionalId: pro.id, body });
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
          href="/"
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
        <InitialAvatar initial={pro.name.replace(/^Dra?\. /, "")[0]} mesh={acc.mesh} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{pro.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2f9e6b" }} />
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{acc.role}</span>
          </div>
        </div>
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
            comece a conversa. {pro.short_name ?? pro.name} responde por aqui.
          </div>
        )}
        {messages.map((m) => {
          const mine = m.sender === "patient";
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: mine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "11px 14px",
                  borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: mine ? acc.bg : "var(--color-surface)",
                  border: mine ? acc.border : "1px solid var(--color-border)",
                }}
              >
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
          placeholder={`escreva pra ${pro.short_name ?? pro.name}...`}
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
