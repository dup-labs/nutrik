import { redirect } from "next/navigation";
import { ProShell } from "@/components/pro/ProShell";
import { BillingBanner } from "@/components/pro/BillingBanner";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { getProBillingState } from "@/lib/billing/queries";
import { ensureProfessionalFromMetadata } from "@/lib/roles";

export default async function ProPainelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/pro/entrada");

  let { data: pro } = await supabase
    .from("professionals")
    .select("id, name, type")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!pro && (await ensureProfessionalFromMetadata(supabase, user))) {
    ({ data: pro } = await supabase
      .from("professionals")
      .select("id, name, type")
      .eq("user_id", user.id)
      .maybeSingle());
  }
  if (!pro) redirect("/pro/cadastro");

  const { count } = await supabase
    .from("patient_professional_links")
    .select("id", { count: "exact", head: true })
    .eq("professional_id", pro.id)
    .eq("status", "active");

  const billing = await getProBillingState();

  return (
    <ProShell proName={pro.name} proType={pro.type} patientCount={count ?? 0}>
      {billing && (
        <BillingBanner
          state={billing.entitlement.state}
          trialDaysLeft={billing.entitlement.trialDaysLeft}
          periodEnd={billing.entitlement.periodEnd}
        />
      )}
      {children}
    </ProShell>
  );
}
