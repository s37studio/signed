import { NextResponse, type NextRequest } from "next/server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isOnboarding = pathname.startsWith("/onboarding");

  if (!isDashboard && !isOnboarding) return NextResponse.next();

  console.log(`[middleware] ${pathname} — fetching session`);

  try {
    const response = await fetch(`${SERVER_URL}/api/auth/get-session`, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });

    const session = await response.json() as {
      user?: { id: string; email: string };
      session?: { activeOrganizationId?: string | null };
    } | null;

    console.log(`[middleware] ${pathname} — user=${session?.user?.email ?? "none"} activeOrg=${session?.session?.activeOrganizationId ?? "none"}`);

    if (!session?.user) {
      console.log(`[middleware] ${pathname} — no user, redirect /login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Laisse passer — la gestion de l'org se fait côté client
    return NextResponse.next();
  } catch (err) {
    console.error(`[middleware] ${pathname} — error:`, err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};
