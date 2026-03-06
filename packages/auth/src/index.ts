import prisma from "@my-better-t-app/db";
import { env } from "@my-better-t-app/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: env.EMAIL_FROM,
        to: user.email,
        subject: "Vérifie ton email — Signed",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Bienvenue sur Signed</h2>
            <p>Clique sur le bouton ci-dessous pour vérifier ton adresse email et accéder à ton compte.</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #18181b; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Vérifier mon email
            </a>
            <p style="margin-top: 16px; color: #71717a; font-size: 14px;">
              Si tu n'as pas créé de compte sur Signed, ignore cet email.
            </p>
          </div>
        `,
      });
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [],
});
