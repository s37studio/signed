"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { usePublicProposal } from "@/features/proposals/hooks/use-public-proposal";
import { useTrackView } from "@/features/proposals/hooks/use-track-view";

import { PublicPasswordForm } from "@/components/proposals/public-password-form";
import { PublicProposalActions } from "@/components/proposals/public-proposal-actions";
import { PublicProposalContent } from "@/components/proposals/public-proposal-content";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProposalPage() {
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const { data, isLoading, error, refetch } = usePublicProposal(
    token,
    password
  );
  const trackView = useTrackView();

  // Check if password is required
  const requiresPassword =
    data && "requiresPassword" in data && data.requiresPassword === true;

  // Get the full proposal (when not requiring password)
  const proposal = requiresPassword ? null : (data as any);

  // Track view once when proposal is loaded
  useEffect(() => {
    if (proposal && "id" in proposal && !trackView.isPending) {
      trackView.mutate({ token });
    }
  }, [proposal?.id]);

  // Handle password submit
  const handlePasswordSubmit = (pwd: string) => {
    setPassword(pwd);
    setPasswordError(undefined);
    // Refetch will automatically use the new password
    refetch();
  };

  // Détecter erreur password invalide
  const isInvalidPassword = error?.message === "Invalid password";

  // Handle password error
  useEffect(() => {
    if (isInvalidPassword) {
      setPasswordError("Mot de passe incorrect");
    }
  }, [error]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Skeleton className="h-[600px] w-full max-w-4xl" />
      </div>
    );
  }

  // Password required OU password invalide
  if (requiresPassword || isInvalidPassword) {
    return (
      <PublicPasswordForm
        onSubmit={handlePasswordSubmit}
        error={passwordError}
        isLoading={isLoading}
      />
    );
  }

  // Not found (vraie erreur)
  if (!proposal || error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-16 text-center">
            <h1 className="text-2xl font-bold mb-2">Proposition introuvable</h1>
            <p className="text-muted-foreground">
              Cette proposition n'existe pas ou a été supprimée.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="bg-linear-to-r from-primary/10 to-primary/5">
            <PublicProposalContent proposal={proposal} />
          </CardHeader>

          <CardContent className="p-6">
            <PublicProposalActions
              token={token}
              status={proposal?.status}
              onSuccess={() => refetch()}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
