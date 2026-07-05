import { NextRequest, NextResponse } from "next/server";

interface WaitlistPayload {
  name:  string;
  email: string;
  role:  string;
}

const TO_EMAIL   = "app@nutrk.io";
const FROM_EMAIL = "Nūtrk <app@nutrk.io>";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || !body.name || !body.email) {
    return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
  }

  const { name, email, role } = body as WaitlistPayload;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[waitlist] RESEND_API_KEY not set — skipping send", { name, email, role });
    return NextResponse.json({ ok: true });
  }

  const date = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "full", timeStyle: "short" });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to:   [TO_EMAIL],
      subject: "[NUTRK.IO] - LEAD INTERESSADO",
      html: `
        <div style="font-family:monospace;padding:32px;background:#0B1020;color:#E8ECF4;border-radius:8px;max-width:480px;">
          <p style="margin:0 0 16px;color:#6DA4B7;font-size:13px;font-weight:700;letter-spacing:0.08em;">NUTRK.IO — NOVO LEAD</p>
          <p style="margin:0 0 8px;font-size:15px;">Nome:   <strong>${name}</strong></p>
          <p style="margin:0 0 8px;font-size:15px;">E-mail: <strong>${email}</strong></p>
          <p style="margin:0 0 24px;font-size:15px;">Perfil: <strong>${role}</strong></p>
          <p style="margin:0;font-size:12px;color:#5A6280;">${date}</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[waitlist] Resend error:", err);
    return NextResponse.json({ error: "Falha ao registrar. Tente novamente." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
