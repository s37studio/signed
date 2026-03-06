import { NextResponse, type NextRequest } from "next/server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Seules les routes dashboard sont protégées
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  console.log(`[middleware] ${pathname} | cookies: ${cookieHeader.slice(0, 80)}...`);

  try {
    const res = await fetch(`${SERVER_URL}/api/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    const data = await res.json() as { user?: { id: string } } | null;
    console.log(`[middleware] ${pathname} | user=${data?.user?.id ?? "none"}`);

    if (!data?.user) {
      console.log(`[middleware] ${pathname} | no session → /login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error(`[middleware] error:`, err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
