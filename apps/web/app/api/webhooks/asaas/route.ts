import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { periodEndFor } from "@/lib/billing/entitlement";
import { sendEmail } from "@/lib/email";
import type { ProfessionalSubscription } from "@/lib/types";

// Webhook do Asaas: única fonte de escrita automática de status de assinatura.
// Configurar no painel do Asaas com o token de ASAAS_WEBHOOK_TOKEN.
// Idempotente: reentrega do mesmo evento produz o mesmo estado final.
export async function POST(request: Request) {
  const token = request.headers.get("asaas-access-token");
  if (!process.env.ASAAS_WEBHOOK_TOKEN || token !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const event: string | undefined = body?.event;
  const payment = body?.payment as
    | { id: string; subscription?: string; dueDate: string; status: string }
    | undefined;

  // só cobranças de assinatura interessam; o resto confirma recebimento
  if (!event || !payment?.subscription) {
    return NextResponse.json({ received: true });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("professional_subscriptions")
    .select("*")
    .eq("asaas_subscription_id", payment.subscription)
    .maybeSingle();
  const sub = data as ProfessionalSubscription | null;
  if (!sub) return NextResponse.json({ received: true });

  const now = new Date().toISOString();

  if (event === "PAYMENT_CONFIRMED" || event === "PAYMENT_RECEIVED") {
    const firstActivation = sub.status !== "active";
    await admin
      .from("professional_subscriptions")
      .update({
        // cancelada continua cancelada — o período pago só estende o acesso
        status: sub.status === "canceled" ? "canceled" : "active",
        current_period_end: periodEndFor(payment.dueDate, sub.plan),
        asaas_last_payment_id: payment.id,
        updated_at: now,
      })
      .eq("professional_id", sub.professional_id);

    if (firstActivation && sub.status !== "canceled") {
      const { data: pro } = await admin
        .from("professionals")
        .select("name, email")
        .eq("id", sub.professional_id)
        .maybeSingle();
      if (pro?.email) {
        await sendEmail({
          to: pro.email,
          subject: "assinatura ativa — bem-vindo ao nūtrk pro",
          heading: `tudo certo, ${pro.name?.split(" ")[0] ?? "profissional"}!`,
          body: "seu pagamento foi confirmado e seu painel está liberado. bom trabalho com seus pacientes 💪",
          ctaLabel: "abrir o painel",
          ctaUrl: "https://app.nutrk.io/pro",
        });
      }
    }
  } else if (event === "PAYMENT_OVERDUE") {
    if (sub.status !== "canceled") {
      await admin
        .from("professional_subscriptions")
        .update({ status: "past_due", updated_at: now })
        .eq("professional_id", sub.professional_id);
    }
  } else if (event === "PAYMENT_REFUNDED" || event === "PAYMENT_CHARGEBACK_REQUESTED") {
    await admin
      .from("professional_subscriptions")
      .update({ status: "past_due", current_period_end: null, updated_at: now })
      .eq("professional_id", sub.professional_id);
  }

  return NextResponse.json({ received: true });
}
