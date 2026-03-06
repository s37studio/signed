import { NextResponse, type NextRequest } from "next/server";

// En production sur Railway, on utilise le réseau privé interne pour éviter
// les problèmes de cookies cross-domain entre les services.
// En dev, on utilise l'URL publique.
const SERVER_URL =
  process.env.SERVER_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_SERVER_URL ??
  "http://localhost:3000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  console.log(`[middleware] ${pathname} | server=${SERVER_URL} | cookie-len=${cookieHeader.length}`);

  try {
    const res = await fetch(`${SERVER_URL}/api/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    const text = await res.text();
    console.log(`[middleware] get-session status=${res.status} body=${text.slice(0, 200)}`);

    let data: { user?: { id: string; email: string } } | null = null;
    try { data = JSON.parse(text); } catch { /* ignore */ }

    if (!data?.user) {
      console.log(`[middleware] no user → redirect /login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log(`[middleware] user=${data.user.email} → OK`);
    return NextResponse.next();
  } catch (err) {
    console.error(`[middleware] fetch error:`, err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
