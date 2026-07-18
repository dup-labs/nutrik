"use server";

// Actions de assinatura do profissional. Não usam o requirePro de lib/pro
// (que bloqueia sem acesso vigente) — quem está bloqueado precisa justamente
// conseguir assinar. Escrita em professional_subscriptions só via service role.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  asaasConfigured,
  cancelAsaasSubscription,
  createCustomer,
  createSubscription,
  getSubscriptionPayments,
  isPaid,
} from "@/lib/billing/asaas";
import { periodEndFor } from "@/lib/billing/entitlement";
import { BILLING, planValue, type BillingPlan } from "@/lib/billing/config";
import { localDateISO } from "@/lib/dates";
import type { ProfessionalSubscription } from "@/lib/types";

const GENERIC_ERROR = "não conseguimos falar com o sistema de pagamento. tenta de novo?";

async function requireProNoGate() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: pro } = await supabase
    .from("professionals")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!pro) return null;

  const { data: subscription } = await supabase
    .from("professional_subscriptions")
    .select("*")
    .eq("professional_id", pro.id)
    .maybeSingle();

  return {
    user,
    pro,
    subscription: (subscription as ProfessionalSubscription | null) ?? null,
  };
}

export async function startSubscription(input: {
  plan: BillingPlan;
  cpfCnpj: string;
}): Promise<{ ok: boolean; error?: string; invoiceUrl?: string }> {
  const ctx = await requireProNoGate();
  if (!ctx) return { ok: false, error: "sessão expirada. entra de novo?" };
  if (input.plan !== "monthly" && input.plan !== "yearly") {
    return { ok: false, error: "plano inválido" };
  }
  const cpfCnpj = input.cpfCnpj.replace(/\D/g, "");
  if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
    return { ok: false, error: "CPF ou CNPJ inválido — confere os números?" };
  }
  if (ctx.subscription?.status === "active") {
    return { ok: false, error: "sua assinatura já está ativa 🎉" };
  }
  if (!asaasConfigured()) {
    return { ok: false, error: "pagamento ainda não está configurado neste ambiente." };
  }

  try {
    const { pro, user, subscription } = ctx;

    let customerId = subscription?.asaas_customer_id ?? null;
    if (!customerId) {
      const customer = await createCustomer({
        name: pro.name,
        email: pro.email ?? user.email ?? "",
        cpfCnpj,
        externalReference: pro.id,
      });
      customerId = customer.id;
    }

    // troca de plano / nova tentativa: encerra a assinatura anterior no Asaas
    // pra não gerar cobrança duplicada
    if (subscription?.asaas_subscription_id && subscription.status !== "canceled") {
      await cancelAsaasSubscription(subscription.asaas_subscription_id).catch(() => {});
    }

    const created = await createSubscription({
      customer: customerId,
      value: planValue(input.plan),
      cycle: BILLING.plans[input.plan].cycle,
      nextDueDate: localDateISO(),
      description: `nūtrk pro — plano ${BILLING.plans[input.plan].label}`,
      externalReference: pro.id,
    });

    // a 1ª cobrança é gerada junto; pega a fatura hospedada pro redirect
    let payments = await getSubscriptionPayments(created.id);
    if (payments.length === 0) {
      await new Promise((r) => setTimeout(r, 1500));
      payments = await getSubscriptionPayments(created.id);
    }

    const admin = createAdminClient();
    const { error } = await admin.from("professional_subscriptions").upsert({
      professional_id: pro.id,
      asaas_customer_id: customerId,
      asaas_subscription_id: created.id,
      asaas_last_payment_id: payments[0]?.id ?? null,
      plan: input.plan,
      status: "pending",
      current_period_end: null,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);

    revalidatePath("/pro", "layout");
    return { ok: true, invoiceUrl: payments[0]?.invoiceUrl };
  } catch (err) {
    console.error("[billing] startSubscription:", err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

export async function cancelSubscription(): Promise<{ ok: boolean; error?: string }> {
  const ctx = await requireProNoGate();
  if (!ctx?.subscription?.asaas_subscription_id) {
    return { ok: false, error: "nenhuma assinatura pra cancelar" };
  }

  try {
    await cancelAsaasSubscription(ctx.subscription.asaas_subscription_id);
    const admin = createAdminClient();
    // mantém current_period_end: acesso segue até o fim do período pago
    await admin
      .from("professional_subscriptions")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("professional_id", ctx.pro.id);
    revalidatePath("/pro", "layout");
    return { ok: true };
  } catch (err) {
    console.error("[billing] cancelSubscription:", err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

/** botão "já paguei / verificar" — sincroniza com o Asaas sem depender do webhook */
export async function refreshSubscriptionStatus(): Promise<{
  ok: boolean;
  error?: string;
  status?: ProfessionalSubscription["status"];
  openInvoiceUrl?: string;
}> {
  const ctx = await requireProNoGate();
  const sub = ctx?.subscription;
  if (!ctx || !sub?.asaas_subscription_id) {
    return { ok: false, error: "nenhuma assinatura pra verificar" };
  }
  if (!asaasConfigured()) {
    return { ok: false, error: "pagamento ainda não está configurado neste ambiente." };
  }

  try {
    const payments = await getSubscriptionPayments(sub.asaas_subscription_id);
    const latest = payments[0];
    const lastPaid = payments.find((p) => isPaid(p.status));

    let status = sub.status;
    let periodEnd = sub.current_period_end;
    if (lastPaid) {
      status = sub.status === "canceled" ? "canceled" : "active";
      periodEnd = periodEndFor(lastPaid.dueDate, sub.plan);
    }
    if (latest && latest.status === "OVERDUE" && sub.status !== "canceled") {
      status = "past_due";
    }

    if (status !== sub.status || periodEnd !== sub.current_period_end) {
      const admin = createAdminClient();
      await admin
        .from("professional_subscriptions")
        .update({
          status,
          current_period_end: periodEnd,
          asaas_last_payment_id: lastPaid?.id ?? sub.asaas_last_payment_id,
          updated_at: new Date().toISOString(),
        })
        .eq("professional_id", ctx.pro.id);
      revalidatePath("/pro", "layout");
    }

    return {
      ok: true,
      status,
      openInvoiceUrl: latest && !isPaid(latest.status) ? latest.invoiceUrl : undefined,
    };
  } catch (err) {
    console.error("[billing] refreshSubscriptionStatus:", err);
    return { ok: false, error: GENERIC_ERROR };
  }
}
