import { NextResponse, type NextRequest } from "next/server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isOnboarding = pathname.startsWith("/onboarding");
  const isAcceptInvitation = pathname.startsWith("/accept-invitation");

  if (!isDashboard && !isOnboarding) return NextResponse.next();

  try {
    const response = await fetch(`${SERVER_URL}/api/auth/get-session`, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await response.json() as {
      user?: { emailVerified?: boolean };
      session?: { activeOrganizationId?: string };
    } | null;

    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // TODO: réactiver quand domaine Resend configuré
    // if (!session.user.emailVerified) {
    //   return NextResponse.redirect(new URL("/verify-email", request.url));
    // }

    const hasOrg = !!session.session?.activeOrganizationId;

    // Dashboard sans org → onboarding
    if (isDashboard && !hasOrg) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // Onboarding avec org déjà active → dashboard
    if (isOnboarding && hasOrg) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};
