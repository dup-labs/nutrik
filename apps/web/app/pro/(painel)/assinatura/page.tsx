import { redirect } from "next/navigation";
import { getProBillingState } from "@/lib/billing/queries";
import { BILLING, yearlySavingsPct } from "@/lib/billing/config";
import { AssinaturaClient } from "./AssinaturaClient";

export const dynamic = "force-dynamic";

// única tela do painel acessível sem acesso vigente (é aqui que se assina)
export default async function AssinaturaPage() {
  const billing = await getProBillingState();
  if (!billing) redirect("/pro/cadastro");

  const { subscription, entitlement } = billing;
  return (
    <AssinaturaClient
      state={entitlement.state}
      trialDaysLeft={entitlement.trialDaysLeft}
      periodEnd={entitlement.periodEnd}
      currentPlan={subscription?.plan ?? null}
      prices={{
        monthly: BILLING.plans.monthly.value,
        yearly: BILLING.plans.yearly.value,
      }}
      savingsPct={yearlySavingsPct()}
    />
  );
}
