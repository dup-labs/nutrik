import { cache } from "react";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { resolveEntitlement, type Entitlement } from "@/lib/billing/entitlement";
import type { Professional, ProfessionalSubscription } from "@/lib/types";

export interface ProBillingState {
  pro: Professional;
  subscription: ProfessionalSubscription | null;
  entitlement: Entitlement;
}

/**
 * Estado de billing do pro logado (null se não logado ou não é pro).
 * cache() por request: layout (banner), gate e página de assinatura
 * compartilham o mesmo fetch.
 */
export const getProBillingState = cache(async (): Promise<ProBillingState | null> => {
  const supabase = await createClient();
  const user = await getAuthUser();
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
    pro: pro as Professional,
    subscription: (subscription as ProfessionalSubscription) ?? null,
    entitlement: resolveEntitlement({
      billingExempt: pro.billing_exempt,
      trialEndsAt: pro.trial_ends_at,
      subscription,
    }),
  };
});
