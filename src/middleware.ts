import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const DASHBOARD_HOSTS = [
  "dashboard-empresa-sem-voce.mtxestrategia.com.br",
  "dashboard.mtxestrategia.com.br",
];

const MEMBERS_HOSTS = [
  "membros.mtxestrategia.com.br",
];

export async function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase();
  const pathname = request.nextUrl.pathname;

  // Subdomínio do dashboard → raiz vai pra /admin/dashboard
  if (DASHBOARD_HOSTS.includes(host) && (pathname === "/" || pathname === "")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // Subdomínio de membros → raiz vai pra /membros
  // Bloqueia também tentativas de acessar /admin e /aplicar via membros host
  if (MEMBERS_HOSTS.includes(host)) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/membros";
      return NextResponse.redirect(url);
    }
    // Bloqueia rotas que não são de membros via membros.*
    if (
      pathname.startsWith("/admin") ||
      pathname === "/aplicar" ||
      pathname === "/obrigado"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/membros";
      return NextResponse.redirect(url);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
