"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { InitialAvatar } from "@/components/ui";
import { IconChevronLeft, IconSend } from "@/components/ui/icons";
import { relativeLabel } from "@/lib/dates";
import { proSendMessage } from "@/lib/pro/actions";
import { meshFor } from "@/lib/pro/shared";
import { createClient } from "@/lib/supabase/client";
import { PRO_ACCENT, type Message, type ProfessionalType } from "@/lib/types";

export function ProChatClient({
  patient,
  proId,
  proType,
  initialMessages,
}: {
  patient: { id: string; name: string; initial: string };
  proId: string;
  proType: ProfessionalType;
  initialMessages: Message[];
}) {
  const acc = PRO_ACCENT[proType];
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`pro-chat-${patient.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "nutrk",
          table: "messages",
          filter: `professional_id=eq.${proId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          if (msg.patient_id !== patient.id) return;
          setMessages((m) => (m.some((x) => x.id === msg.id) ? m : [...m, msg]));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [patient.id, proId]);

  function handleSend() {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    setMessages((m) => [
      ...m,
      {
        id: `tmp-${Date.now()}`,
        patient_id: patient.id,
        professional_id: proId,
        sender: "professional",
        body,
        created_at: new Date().toISOString(),
        read_at: null,
      },
    ]);
    proSendMessage({ patientId: patient.id, body });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 90px)", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "18px 20px 12px", borderBottom: "1px solid var(--color-border)" }}>
        <Link
          href="/pro/mensagens"
          style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--color-border)", background: "var(--color-surface-elevated)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text)", flexShrink: 0 }}
        >
          <IconChevronLeft size={17} />
        </Link>
        <InitialAvatar initial={patient.initial} mesh={meshFor(patient.id)} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{patient.name}</div>
          <Link href={`/pro/pacientes/${patient.id}`} style={{ fontSize: 12, color: "var(--color-orange)", textDecoration: "none", fontWeight: 600 }}>
            ver caso completo
          </Link>
        </div>
      </div>

      <div className="ntrk-scroll" style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-muted)", marginTop: 24 }}>
            comece a conversa com {patient.name.split(" ")[0]}.
          </div>
        )}
        {messages.map((m) => {
          const mine = m.sender === "professional";
          return (
            <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
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
              <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)", marginTop: 4, padding: "0 4px" }}>
                {relativeLabel(m.created_at)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderTop: "1px solid var(--color-border)" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`escreva pra ${patient.name.split(" ")[0]}...`}
          style={{ flex: 1, height: 46, padding: "0 18px", borderRadius: "var(--radius-pill)", border: "1px solid var(--color-border-strong)", background: "var(--color-surface-elevated)", fontSize: 14, outline: "none" }}
        />
        <button
          onClick={handleSend}
          style={{ width: 46, height: 46, borderRadius: "50%", border: "none", background: "var(--color-orange)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, boxShadow: "0 2px 8px rgba(254,95,51,0.24)", color: "#fff" }}
        >
          <IconSend size={19} />
        </button>
      </div>
    </div>
  );
}
