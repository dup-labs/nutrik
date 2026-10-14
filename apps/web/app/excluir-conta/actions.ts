"use server";

// Pedido de exclusão por quem não tem mais acesso ao app. Chega em
// app@nutrk.io; a pessoa responde de lá após confirmar que o email é dela
// (por isso NÃO enviamos nada pro email informado: evita virar relay de spam).

import { sendEmail } from "@/lib/email";

const SUPPORT = "app@nutrk.io";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export type RequestResult = { ok: boolean; error?: string };

export async function requestAccountDeletion(input: {
  email: string;
  note: string;
  website?: string; // honeypot: bot preenche, gente não
}): Promise<RequestResult> {
  if (input.website) return { ok: true }; // finge sucesso pro bot
  const email = input.email.trim().toLowerCase().slice(0, 200);
  const note = input.note.trim().slice(0, 1000);
  if (!EMAIL_RE.test(email)) return { ok: false, error: "confere o email? parece que falta alguma coisa." };

  if (!process.env.RESEND_API_KEY) {
    return {
      ok: false,
      error: `não conseguimos enviar por aqui agora. escreve pra ${SUPPORT} com o email da conta.`,
    };
  }

  await sendEmail({
    to: SUPPORT,
    subject: "pedido de exclusão de conta",
    heading: "pedido de exclusão de conta",
    body: `<p><strong>email da conta:</strong> ${esc(email)}</p>${
      note ? `<p><strong>mensagem:</strong><br>${esc(note).replace(/\n/g, "<br>")}</p>` : ""
    }<p style="color:#6b6f78;font-size:13px">confirmar que o pedido veio do dono do email (responder pra esse endereço) antes de excluir. prazo: até 30 dias.</p>`,
  });
  return { ok: true };
}
