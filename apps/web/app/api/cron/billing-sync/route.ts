import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { asaasConfigured, getSubscriptionPayments, isPaid } from "@/lib/billing/asaas";
import { periodEndFor } from "@/lib/billing/entitlement";
import type { ProfessionalSubscription } from "@/lib/types";

// Reconciliação diária (vercel.json → crons): rede de segurança pra webhook
// perdido. Sincroniza com o Asaas toda assinatura que não está
// comprovadamente em dia.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!asaasConfigured()) {
    return NextResponse.json({ ok: false, reason: "asaas não configurado" });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("professional_subscriptions")
    .select("*")
    .in("status", ["pending", "past_due", "active"])
    .not("asaas_subscription_id", "is", null);

  const subs = (data ?? []) as ProfessionalSubscription[];
  const nowMs = Date.now();
  let checked = 0;
  let updated = 0;

  for (const sub of subs) {
    // ativa com período vigente não precisa de chamada ao Asaas
    if (
      sub.status === "active" &&
      sub.current_period_end &&
      new Date(sub.current_period_end).getTime() > nowMs
    ) {
      continue;
    }
    checked++;

    try {
      const payments = await getSubscriptionPayments(sub.asaas_subscription_id!);
      const latest = payments[0];
      const lastPaid = payments.find((p) => isPaid(p.status));

      let status: ProfessionalSubscription["status"] = sub.status;
      let periodEnd = sub.current_period_end;
      if (lastPaid) {
        status = "active";
        periodEnd = periodEndFor(lastPaid.dueDate, sub.plan);
      }
      if (latest?.status === "OVERDUE") status = "past_due";

      if (status !== sub.status || periodEnd !== sub.current_period_end) {
        await admin
          .from("professional_subscriptions")
          .update({
            status,
            current_period_end: periodEnd,
            asaas_last_payment_id: lastPaid?.id ?? sub.asaas_last_payment_id,
            updated_at: new Date().toISOString(),
          })
          .eq("professional_id", sub.professional_id);
        updated++;
      }
    } catch (err) {
      console.error("[billing-sync]", sub.professional_id, err);
    }
  }

  return NextResponse.json({ ok: true, total: subs.length, checked, updated });
}
