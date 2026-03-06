import prisma from "@my-better-t-app/db";
import { env } from "@my-better-t-app/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";

// Extrait le domaine parent pour partager le cookie entre web et server
// ex: "https://web-production-7dc7f.up.railway.app" → ".railway.app"
// ex: "https://www.s37.studio" → ".s37.studio"
function getCookieDomain(origin: string): string | undefined {
  try {
    const host = new URL(origin).hostname;
    const parts = host.split(".");
    if (parts.length >= 2) {
      return "." + parts.slice(-2).join(".");
    }
  } catch {}
  return undefined;
}

const cookieDomain = getCookieDomain(env.CORS_ORIGIN);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 1,
      membershipLimit: 50,
    }),
  ],
});
