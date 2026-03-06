import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Log tous les cookies pour identifier le bon nom
  const allCookies = request.cookies.getAll();
  console.log(`[middleware] ${pathname} | cookies: ${JSON.stringify(allCookies.map(c => c.name))}`);

  // Better Auth utilise "better-auth-session" comme nom de cookie
  const sessionCookie =
    request.cookies.get("better-auth-session") ??
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__session") ??
    allCookies.find(c => c.name.includes("better-auth") || c.name.includes("session"));

  console.log(`[middleware] session cookie: ${sessionCookie?.name ?? "none"}`);

  if (!sessionCookie?.value) {
    console.log(`[middleware] no session cookie → /login`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
