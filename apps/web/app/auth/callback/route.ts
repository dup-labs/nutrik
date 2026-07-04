import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// troca do code (OAuth Google / links de email) por sessão
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next) return NextResponse.redirect(`${origin}${next}`);

      // sem perfil ainda (ex.: primeiro login com Google) → completar cadastro
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, onboarding_completed_at")
          .eq("id", user.id)
          .maybeSingle();
        if (!profile) return NextResponse.redirect(`${origin}/cadastro?completar=1`);
        if (!profile.onboarding_completed_at)
          return NextResponse.redirect(`${origin}/anamnese`);
      }
      return NextResponse.redirect(`${origin}/`);
    }
  }
  return NextResponse.redirect(`${origin}/login`);
}
