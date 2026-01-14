"use client";

import { useState } from "react";

import { useRequestRevision } from "@/features/proposals/hooks/use-request-revision";
import { useValidateProposal } from "@/features/proposals/hooks/use-validate-proposal";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type PublicProposalActionsProps = {
  token: string;
  status: string;
  onSuccess?: () => void;
};

export function PublicProposalActions({
  token,
  status,
  onSuccess,
}: PublicProposalActionsProps) {
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionMessage, setRevisionMessage] = useState("");

  const validateProposal = useValidateProposal();
  const requestRevision = useRequestRevision();

  const handleValidate = () => {
    if (confirm("Êtes-vous sûr de vouloir accepter cette proposition ?")) {
      validateProposal.mutate(
        { token },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    }
  };

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (revisionMessage.length < 10) {
      return;
    }

    requestRevision.mutate(
      { token, message: revisionMessage },
      {
        onSuccess: () => {
          setShowRevisionForm(false);
          setRevisionMessage("");
          onSuccess?.();
        },
      }
    );
  };

  // Si pas PENDING, afficher le statut
  if (status !== "PENDING") {
    return (
      <div className="border-t pt-6">
        {status === "WON" && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-center text-green-600 font-medium">
              Cette proposition a été acceptée. Merci ! 🎉
            </p>
          </div>
        )}

        {status === "LOST" && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-center text-red-600 font-medium">
              Cette proposition a été refusée.
            </p>
          </div>
        )}

        {status === "REVISION" && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-center text-blue-600 font-medium">
              Votre demande de révision a été envoyée. Nous reviendrons vers
              vous prochainement !
            </p>
          </div>
        )}
      </div>
    );
  }

  // Actions disponibles
  return (
    <div className="border-t pt-6 space-y-4">
      <h3 className="font-semibold">Votre réponse</h3>

      {!showRevisionForm ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleValidate}
            disabled={validateProposal.isPending}
            className="flex-1"
            size="lg"
          >
            ✅ Accepter la proposition
          </Button>
          <Button
            onClick={() => setShowRevisionForm(true)}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            📝 Demander une révision
          </Button>
        </div>
      ) : (
        <form onSubmit={handleRevisionSubmit} className="space-y-4">
          <div>
            <Label htmlFor="revision">
              Qu'est-ce que vous souhaitez modifier ?
            </Label>
            <textarea
              id="revision"
              value={revisionMessage}
              onChange={(e) => setRevisionMessage(e.target.value)}
              placeholder="Décrivez les modifications souhaitées..."
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum 10 caractères
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={
                requestRevision.isPending || revisionMessage.length < 10
              }
              className="flex-1"
            >
              Envoyer la demande
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowRevisionForm(false);
                setRevisionMessage("");
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
