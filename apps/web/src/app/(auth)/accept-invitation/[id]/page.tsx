"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";

export default function AcceptInvitationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [invitation, setInvitation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (isPending) return;
    authClient.organization.getInvitation(
      { query: { id } },
      {
        onSuccess: (ctx) => {
          setInvitation(ctx.data);
          setIsLoading(false);
        },
        onError: () => {
          toast.error("Invitation invalide ou expirée");
          setIsLoading(false);
        },
      }
    );
  }, [id, isPending]);

  async function handleAccept() {
    setIsAccepting(true);
    await authClient.organization.acceptInvitation(
      { invitationId: id },
      {
        onSuccess: async (ctx) => {
          await authClient.organization.setActive({ organizationId: ctx.data.member.organizationId });
          toast.success("Invitation acceptée !");
          router.push("/dashboard");
        },
        onError: (err) => {
          toast.error(err.error.message || "Erreur lors de l'acceptation");
          setIsAccepting(false);
        },
      }
    );
  }

  async function handleReject() {
    await authClient.organization.rejectInvitation(
      { invitationId: id },
      {
        onSuccess: () => {
          toast.success("Invitation refusée");
          router.push("/dashboard");
        },
      }
    );
  }

  if (isPending || isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0E0E10]">
      <Loader />
    </div>
  );

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0E0E10]">
        <div className="w-full max-w-md rounded-2xl bg-[#0C0C0D] p-8 border border-zinc-800 text-center">
          <h1 className="text-xl font-bold text-zinc-50 mb-4">Connecte-toi pour accepter l'invitation</h1>
          <Button onClick={() => router.push(`/login?redirect=/accept-invitation/${id}`)}>
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  if (!invitation) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0E0E10]">
      <div className="w-full max-w-md rounded-2xl bg-[#0C0C0D] p-8 border border-zinc-800 text-center">
        <h1 className="text-xl font-bold text-zinc-50 mb-2">Invitation introuvable</h1>
        <p className="text-zinc-400 text-sm">Cette invitation est invalide ou a expiré.</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0E0E10]">
      <div className="w-full max-w-md rounded-2xl bg-[#0C0C0D] p-8 border border-zinc-800 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-2xl">
            🤝
          </div>
          <h1 className="text-xl font-bold text-zinc-50 mb-2">
            Invitation à rejoindre
          </h1>
          <p className="text-zinc-300 font-semibold text-lg">
            {invitation.organizationName ?? "une organisation"}
          </p>
          <p className="text-zinc-500 text-sm mt-2">
            En tant que <span className="text-zinc-400">{invitation.role}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            onClick={handleReject}
          >
            Refuser
          </Button>
          <Button
            className="flex-1"
            onClick={handleAccept}
            disabled={isAccepting}
          >
            {isAccepting ? "Acceptation..." : "Accepter"}
          </Button>
        </div>
      </div>
    </div>
  );
}
