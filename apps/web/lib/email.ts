// Emails transacionais do produto via Resend (direto, sem Supabase no meio).
// Sem RESEND_API_KEY configurada, vira no-op silencioso (dev sem chave).

const FROM = "Nūtrk <oi@nutrk.io>";

export async function sendEmail(input: {
  to: string;
  subject: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !input.to) return;

  const cta =
    input.ctaLabel && input.ctaUrl
      ? `<a href="${input.ctaUrl}" style="display:inline-block;margin-top:24px;padding:14px 28px;border-radius:40px;background:#fe5f33;color:#ffffff;font-weight:600;font-size:15px;text-decoration:none;">${input.ctaLabel}</a>`
      : "";

  const html = `
  <div style="margin:0;padding:32px 16px;background:#e7ecf7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;">
    <div style="max-width:480px;margin:0 auto;">
      <div style="font-weight:900;font-size:26px;letter-spacing:-0.03em;color:#1b1c1d;margin-bottom:16px;">N&#363;trk</div>
      <div style="background:#ffffff;border:1px solid rgba(27,28,29,0.10);border-radius:16px;padding:32px 28px;">
        <div style="font-weight:700;font-size:20px;letter-spacing:-0.02em;color:#1b1c1d;margin-bottom:12px;">${input.heading}</div>
        <div style="font-size:15px;line-height:1.6;color:#333333;">${input.body}</div>
        ${cta}
      </div>
      <div style="font-size:12px;color:#6b6f78;margin-top:16px;text-align:center;">
        voc&#234; recebeu este email porque usa o N&#363;trk. a jornada, todo dia.
      </div>
    </div>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [input.to], subject: input.subject, html }),
    });
    if (!res.ok) {
      console.error("[email] Resend error:", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    // email nunca derruba a ação principal
    console.error("[email] send failed:", err);
  }
}
