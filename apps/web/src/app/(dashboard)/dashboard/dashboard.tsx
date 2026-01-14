"use client";

import { authClient } from "@/lib/auth-client";

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  return (
    <div className="grid gap-6">
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Aperçu</h2>
        <p className="text-muted-foreground">
          Le contenu du dashboard va ici (leads, propals, etc.)
        </p>
      </div>
    </div>
  );
}
