import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Troca inteligente de fluxo (usada pelo menu da landing):
//   /trocar?para=pro       → pro logado entra direto; senão desloga e vai pra /pro/entrada
//   /trocar?para=paciente  → paciente logado entra direto; senão desloga e vai pra /entrada
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const para = searchParams.get("para") === "pro" ? "pro" : "paciente";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: pro } = await supabase
      .from("professionals")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    const isPro =
      !!pro || (user.user_metadata as { role?: string } | null)?.role === "pro";

    if (para === "pro" && isPro) return NextResponse.redirect(`${origin}/pro`);
    if (para === "paciente" && !isPro) return NextResponse.redirect(`${origin}/`);

    // papel não bate com o destino → troca de conta
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(
    `${origin}${para === "pro" ? "/pro/entrada" : "/entrada"}`,
  );
}
