import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/entrada",
  "/login",
  "/cadastro",
  "/recuperar",
  "/redefinir",
  "/confirmar",
  "/auth",
  "/pro/cadastro",
  "/pro/entrada",
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    // deslogado em rota do painel → entrada do profissional
    url.pathname = pathname.startsWith("/pro") ? "/pro/entrada" : "/entrada";
    return NextResponse.redirect(url);
  }

  if (
    user &&
    (pathname === "/entrada" || pathname === "/login" || pathname === "/pro/entrada")
  ) {
    const url = request.nextUrl.clone();
    // o layout do (app) redireciona profissionais pro /pro
    url.pathname = pathname === "/pro/entrada" ? "/pro" : "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons|fonts|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|otf|woff2?)$).*)",
  ],
};
