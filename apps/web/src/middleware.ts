import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard"];
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  try {
    const response = await fetch(`${SERVER_URL}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await response.json() as { user?: { emailVerified?: boolean } } | null;

    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // TODO: réactiver quand domaine Resend configuré
    // if (!session.user.emailVerified) {
    //   return NextResponse.redirect(new URL("/verify-email", request.url));
    // }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
