import { NextRequest, NextResponse } from "next/server";

interface WaitlistPayload {
  name:  string;
  email: string;
  role:  string;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || !body.name || !body.email) {
    return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
  }

  const { name, email, role } = body as WaitlistPayload;

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL ?? "hi@nutrk.com";
  const fromEmail  = process.env.FROM_EMAIL  ?? "Nūtrk <noreply@nutrk.com>";

  if (!apiKey) {
    // In development without a key, just acknowledge
    console.log("[waitlist] RESEND_API_KEY not set — skipping email send", { name, email, role });
    return NextResponse.json({ ok: true });
  }

  // Send confirmation to lead
  const confirmRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromEmail,
      to:   [email],
      subject: "Recebemos sua solicitação — Nūtrk",
      html: `
        <div style="font-family:'Inter',sans-serif;background:#05070B;color:#E8ECF4;padding:48px 32px;max-width:560px;margin:0 auto;border-radius:12px;">
          <img src="https://nutrk.com/nutrk-logo.svg" alt="Nūtrk" style="height:20px;margin-bottom:32px;opacity:0.9;" />
          <h1 style="font-size:24px;font-weight:800;color:#E8ECF4;margin:0 0 16px;letter-spacing:-0.03em;">Solicitação recebida.</h1>
          <p style="font-size:15px;line-height:1.65;color:#5A6280;margin:0 0 24px;">
            Olá, <strong style="color:#E8ECF4;">${name}</strong>! Recebemos sua solicitação de acesso antecipado ao Nūtrk como <strong style="color:#6DA4B7;">${role}</strong>.
          </p>
          <p style="font-size:15px;line-height:1.65;color:#5A6280;margin:0 0 32px;">
            As vagas são limitadas. Entraremos em contato assim que uma abrir para você.
          </p>
          <p style="font-size:13px;color:#2E344D;margin:0;">Nūtrk · Feito de consistência.</p>
        </div>
      `,
    }),
  });

  if (!confirmRes.ok) {
    const err = await confirmRes.json().catch(() => ({}));
    console.error("[waitlist] Resend error (confirmation):", err);
    return NextResponse.json({ error: "Falha ao enviar e-mail de confirmação." }, { status: 500 });
  }

  // Notify admin
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromEmail,
      to:   [adminEmail],
      subject: `[Waitlist] Novo lead: ${name}`,
      html: `
        <div style="font-family:monospace;padding:24px;background:#0B1020;color:#E8ECF4;border-radius:8px;max-width:400px;">
          <p style="margin:0 0 8px;color:#6DA4B7;font-weight:700;">NOVO LEAD — WAITLIST</p>
          <p style="margin:0 0 4px;">Nome:   <strong>${name}</strong></p>
          <p style="margin:0 0 4px;">E-mail: <strong>${email}</strong></p>
          <p style="margin:0;">Perfil: <strong>${role}</strong></p>
        </div>
      `,
    }),
  }).catch(err => console.error("[waitlist] Resend error (admin):", err));

  return NextResponse.json({ ok: true });
}
