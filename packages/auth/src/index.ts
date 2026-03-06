import prisma from "@my-better-t-app/db";
import { env } from "@my-better-t-app/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // TODO: réactiver quand domaine Resend configuré
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const result = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: user.email,
        subject: "Vérifie ton email — Signed",
        html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:'Geist Sans',ui-sans-serif,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          <!-- Logo / Nom -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:22px;font-weight:700;color:#fafafa;letter-spacing:-0.5px;">Signed</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#18181b;border:1px solid #27272a;border-radius:12px;padding:40px 36px;">

              <!-- Icone -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="display:inline-block;background-color:#27272a;border-radius:50%;width:52px;height:52px;line-height:52px;text-align:center;">
                      <span style="font-size:24px;">✉️</span>
                    </div>
                  </td>
                </tr>

                <!-- Titre -->
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#fafafa;letter-spacing:-0.3px;">
                      Vérifie ton adresse email
                    </h1>
                  </td>
                </tr>

                <!-- Texte -->
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <p style="margin:0;font-size:15px;color:#a1a1aa;line-height:1.6;">
                      Bienvenue${user.name ? `, <strong style="color:#d4d4d8;">${user.name}</strong>` : ""} ! Clique sur le bouton ci-dessous pour activer ton compte et commencer à créer tes propositions.
                    </p>
                  </td>
                </tr>

                <!-- Bouton -->
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <a href="${url}"
                      style="display:inline-block;background-color:#fafafa;color:#09090b;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;letter-spacing:0.1px;">
                      Vérifier mon email
                    </a>
                  </td>
                </tr>

                <!-- Séparateur -->
                <tr>
                  <td style="border-top:1px solid #27272a;padding-top:24px;">
                    <p style="margin:0;font-size:13px;color:#52525b;text-align:center;line-height:1.5;">
                      Si tu n'as pas créé de compte sur Signed, ignore cet email.<br/>
                      Ce lien expire dans 24 heures.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#3f3f46;">
                © ${new Date().getFullYear()} Signed — Propositions commerciales
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });
      if (result.error) {
        console.error("[Resend] Failed to send verification email:", result.error);
      } else {
        console.log("[Resend] Verification email sent to:", user.email, "id:", result.data?.id);
      }
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 1,
      membershipLimit: 50,
      sendInvitationEmail: async (data) => {
        const inviteUrl = `${env.APP_URL ?? "http://localhost:3001"}/accept-invitation/${data.id}`;
        const result = await resend.emails.send({
          from: env.EMAIL_FROM,
          to: data.email,
          subject: `Invitation à rejoindre ${data.organization.name} — Signed`,
          html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:'Geist Sans',ui-sans-serif,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
        <tr><td align="center" style="padding-bottom:32px;">
          <span style="font-size:22px;font-weight:700;color:#fafafa;letter-spacing:-0.5px;">Signed</span>
        </td></tr>
        <tr><td style="background-color:#18181b;border:1px solid #27272a;border-radius:12px;padding:40px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding-bottom:12px;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#fafafa;">Tu as été invité</h1>
            </td></tr>
            <tr><td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:15px;color:#a1a1aa;line-height:1.6;">
                <strong style="color:#d4d4d8;">${(data.inviter as any).name || (data.inviter as any).email || "Quelqu'un"}</strong> t'invite à rejoindre l'organisation <strong style="color:#d4d4d8;">${data.organization.name}</strong> sur Signed.
              </p>
            </td></tr>
            <tr><td align="center" style="padding-bottom:32px;">
              <a href="${inviteUrl}" style="display:inline-block;background-color:#fafafa;color:#09090b;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
                Accepter l'invitation
              </a>
            </td></tr>
            <tr><td style="border-top:1px solid #27272a;padding-top:24px;">
              <p style="margin:0;font-size:13px;color:#52525b;text-align:center;">
                Cette invitation expire dans 48 heures.
              </p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;">
          <p style="margin:0;font-size:12px;color:#3f3f46;">© ${new Date().getFullYear()} Signed — Propositions commerciales</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        });
        if (result.error) {
          console.error("[Resend] Failed to send invitation email:", result.error);
        }
      },
    }),
  ],
});
