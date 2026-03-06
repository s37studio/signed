# État du projet — Signed

## Stack
Monorepo Turborepo + Bun — Next.js (frontend :3001) + Hono/tRPC (backend :3000) + Prisma + PostgreSQL + Better Auth

## Ce qui a été fait

### Fixes backend
- `proposal.trackView` supprimé (doublon avec `proposalView.trackView`)
- Toutes les `throw new Error()` remplacées par `TRPCError` avec les bons codes HTTP (`NOT_FOUND`, `UNAUTHORIZED`)
- `DASHBOARD_URL` Discord sorti du code, maintenant via variable d'env `APP_URL`

### Auth — Page login
- Formulaire signup accessible depuis la page login (toggle sign in / sign up)
- Redirect vers `/dashboard` après connexion

### Vérification email (EN PAUSE)
Tout le code est en place mais **désactivé** en attendant de configurer un vrai domaine sur Resend.

**Ce qui est fait :**
- Better Auth configuré avec `emailVerification` + Resend
- Template email dark branded (même style que l'app)
- Page `/verify-email` avec bouton "Renvoyer l'email"
- Middleware Next.js qui bloque `/dashboard` si email non vérifié

**Pour réactiver :**
1. Configurer un domaine sur [resend.com](https://resend.com) et mettre à jour `EMAIL_FROM` sur Railway
2. Dans `packages/auth/src/index.ts` : passer `requireEmailVerification` à `true`
3. Dans `apps/web/src/middleware.ts` : décommenter le check `emailVerified`
4. Dans `apps/web/src/components/sign-in-form.tsx` : décommenter le redirect vers `/verify-email`

**Variables Railway à avoir (service server) :**
- `RESEND_API_KEY` — déjà configuré
- `EMAIL_FROM` — ex: `Signed <noreply@tondomaine.com>`
- `APP_URL` — ex: `https://web-production-7dc7f.up.railway.app`

## Roadmap multi-tenant (pas commencé)

Pour ouvrir le SaaS à tout le monde, dans cet ordre :

1. **Organisations** — schéma BDD (`Organization`, `OrganizationMember`) + plugin `organization` de Better Auth
2. **Isolation des données** — filtrer tous les `getAll` par `organizationId` de la session + vérifier l'appartenance sur chaque mutation
3. **Invitations** — inviter un membre par email (Better Auth gère ça)
4. **Onboarding** — page "créer / rejoindre une org" au premier login
5. **UI membres** — page Settings > Members (liste, inviter, changer rôle, retirer)
6. **Vérification email** — réactiver une fois domaine Resend configuré

> ⚠️ Les étapes 1 et 2 sont bloquantes avant d'ouvrir à des utilisateurs externes — sans ça, tout le monde voit les données de tout le monde.
