import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrada");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) redirect("/cadastro?completar=1");
  if (!profile.onboarding_completed_at) redirect("/anamnese");

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--gradient-canvas)",
        maxWidth: 560,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div style={{ paddingBottom: 96 }}>{children}</div>
      <BottomNav />
    </div>
  );
}
