"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, InitialAvatar, PrimaryButton } from "@/components/ui";
import { IconCopy, IconLogout } from "@/components/ui/icons";
import { signOut } from "@/lib/actions";
import { updateProfessionalProfile } from "@/lib/pro/actions";
import { PRO_ACCENT, type ProfessionalType } from "@/lib/types";

export function ProPerfilClient({
  pro,
  regLabel,
}: {
  pro: {
    name: string;
    type: ProfessionalType;
    regCode: string;
    clinic: string;
    phone: string;
    bio: string;
    tags: string[];
    inviteCode: string;
  };
  regLabel: string;
}) {
  const acc = PRO_ACCENT[pro.type];
  const [name, setName] = useState(pro.name);
  const [reg, setReg] = useState(pro.regCode);
  const [clinic, setClinic] = useState(pro.clinic);
  const [phone, setPhone] = useState(pro.phone);
  const [bio, setBio] = useState(pro.bio);
  const [tags, setTags] = useState(pro.tags.join(", "));
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSave() {
    if (busy) return;
    setBusy(true);
    await updateProfessionalProfile({
      name,
      regCode: reg,
      clinic,
      phone,
      bio,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setSaved(true);
    setBusy(false);
    setTimeout(() => setSaved(false), 2500);
  }

  const field = (
    label: string,
    value: string,
    set: (v: string) => void,
    placeholder = "",
    area = false,
  ) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
        {label}
      </div>
      {area ? (
        <textarea
          value={value}
          onChange={(e) => set(e.target.value)}
          placeholder={placeholder}
          style={{ width: "100%", boxSizing: "border-box", minHeight: 76, padding: "12px 14px", borderRadius: 10, border: "1px solid var(--color-border-strong)", background: "var(--color-surface-elevated)", fontSize: 14, lineHeight: 1.5, outline: "none", resize: "none" }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => set(e.target.value)}
          placeholder={placeholder}
          style={{ width: "100%", boxSizing: "border-box", height: 46, padding: "0 14px", borderRadius: 10, border: "1px solid var(--color-border-strong)", background: "var(--color-surface-elevated)", fontSize: 14, outline: "none" }}
        />
      )}
    </div>
  );

  return (
    <div style={{ padding: "28px 24px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <InitialAvatar initial={name.replace(/^Dra?\. /i, "")[0] ?? "?"} mesh={acc.mesh} size={64} />
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 24, letterSpacing: "-0.03em" }}>
            {name}
          </div>
          <div style={{ fontSize: 13, color: acc.accent }}>{acc.role}</div>
        </div>
      </div>

      <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            seu código de convite
          </div>
          <div style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 18, letterSpacing: "0.06em", marginTop: 3 }}>
            {pro.inviteCode}
          </div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(pro.inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: "var(--radius-pill)", background: acc.soft, border: "none", color: acc.accent, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          <IconCopy size={14} /> {copied ? "copiado!" : "copiar"}
        </button>
      </Card>

      <Link
        href="/pro/assinatura"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          marginBottom: 20,
          borderRadius: 14,
          border: "1px solid var(--color-border)",
          background: "var(--color-surface-elevated)",
          textDecoration: "none",
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>assinatura</div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
            plano, pagamento e fatura
          </div>
        </div>
        <span style={{ color: acc.accent, fontWeight: 700 }}>→</span>
      </Link>

      {field("nome profissional", name, setName)}
      {field(regLabel, reg, setReg, regLabel === "CRN" ? "CRN-3 · 45.892" : "CREF · 082451-G/SP")}
      {field("onde atende", clinic, setClinic, "Espaço Vitalità — Pinheiros, SP")}
      {field("telefone", phone, setPhone, "(11) 99999-9999")}
      {field("bio (aparece pro paciente)", bio, setBio, "como você trabalha, em uma ou duas frases.", true)}
      {field("especialidades (separadas por vírgula)", tags, setTags, "aderência, comportamento alimentar")}

      <PrimaryButton disabled={busy || name.trim().length < 2} onClick={handleSave}>
        {busy ? "salvando..." : saved ? "salvo ✓" : "salvar perfil"}
      </PrimaryButton>

      <button
        onClick={() => signOut()}
        style={{ width: "100%", height: 50, marginTop: 24, borderRadius: "var(--radius-pill)", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", color: "#ef4444", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <IconLogout size={17} /> sair da conta
      </button>
    </div>
  );
}
