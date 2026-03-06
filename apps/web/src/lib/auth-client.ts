import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

// On pointe vers l'origine courante (même domaine) grâce au reverse proxy
// Next.js qui forward /api/auth/* et /trpc/* vers le backend.
// Ainsi les cookies sont same-domain et fonctionnent correctement.
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  plugins: [organizationClient()],
});
