"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { usePublicProposal } from "@/features/proposals/hooks/use-public-proposal";
import { useTrackProposalView } from "@/features/proposals/hooks/use-track-proposal-view";

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

  // Check if password is required
  const requiresPassword =
    data && "requiresPassword" in data && data.requiresPassword === true;

  // Get the full proposal (when not requiring password)
  const proposal = requiresPassword ? null : (data as any);

  // Track view with duration (only when proposal is loaded)
  useTrackProposalView(proposal?.id || "");

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
    <div className="min-h-screen">
      <PublicProposalContent proposal={proposal} />
      
      {/* Actions floating button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Card className="shadow-2xl">
          <CardContent className="p-4">
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
