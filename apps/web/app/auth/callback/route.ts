import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveDestination } from "@/lib/roles";
import { safeNext } from "@/lib/auth/safe-next";

// Troca do code (OAuth Google/Apple, links de email) por sessão e roteia por papel.
//
// Chega aqui de dois jeitos, e os dois precisam funcionar:
//   web    → o provider redireciona a aba direto pra app.nutrk.io/auth/callback
//   nativo → o provider volta por io.nutrk.app://auth/callback?code=...; o
//            handler de deep link da casca navega o webview pra
//            /auth/callback?code=... (mesma query). O PKCE code_verifier está
//            no cookie do webview, que é quem faz esta request.
// Por isso nada aqui pode depender de Referer, de state em memória ou de
// estar no mesmo "navegador" que abriu o provider.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));
  const flow = searchParams.get("flow");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next) return NextResponse.redirect(`${origin}${next}`);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const dest = await resolveDestination(supabase, user, flow);
        return NextResponse.redirect(`${origin}${dest}`);
      }
      return NextResponse.redirect(`${origin}/`);
    }
    // falha mais comum no app: code_verifier ausente (o login começou em
    // outro navegador/webview, ou o cookie foi limpo) — volta pro login.
    console.error("[auth/callback] exchangeCodeForSession:", error.message);
  } else if (searchParams.get("error")) {
    // provider recusou / usuário cancelou (ex.: fechou a tela da Apple)
    console.warn("[auth/callback] provider error:", searchParams.get("error_description"));
  }
  return NextResponse.redirect(`${origin}${flow === "pro" ? "/pro/entrada" : "/login"}`);
}
