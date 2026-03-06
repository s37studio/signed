"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const { data: session } = authClient.useSession();
  const [isSending, setIsSending] = useState(false);

  async function handleResend() {
    if (!session?.user?.email) return;
    setIsSending(true);
    await authClient.sendVerificationEmail(
      { email: session.user.email, callbackURL: "/dashboard" },
      {
        onSuccess: () => {
          toast.success("Email renvoyé ! Vérifie ta boîte mail.");
        },
        onError: (error) => {
          toast.error(error.error.message || "Erreur lors de l'envoi.");
        },
      }
    );
    setIsSending(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0E0E10]">
      <div className="w-full max-w-md rounded-2xl bg-[#0C0C0D] p-8 text-center border border-zinc-800">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-zinc-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-zinc-50">
          Vérifie ton email
        </h1>
        <p className="mb-1 text-zinc-400">
          Un email de vérification a été envoyé à
        </p>
        <p className="mb-6 font-medium text-zinc-200">
          {session?.user?.email ?? "ton adresse email"}
        </p>
        <p className="mb-8 text-sm text-zinc-500">
          Clique sur le lien dans l'email pour activer ton compte. Pense à
          vérifier tes spams.
        </p>

        <Button
          onClick={handleResend}
          disabled={isSending}
          variant="outline"
          className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          {isSending ? "Envoi en cours..." : "Renvoyer l'email"}
        </Button>

        <button
          onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/login"; } } })}
          className="mt-4 text-sm text-zinc-600 hover:text-zinc-400 underline"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
