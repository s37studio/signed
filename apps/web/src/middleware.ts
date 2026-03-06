import { NextResponse } from "next/server";

// Middleware minimal — pas de vérification auth ici car le cookie
// est sur un domaine différent (server vs web sur Railway).
// La protection auth est gérée côté client dans le layout dashboard.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
