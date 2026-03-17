"use client";

import { getTemplate } from "@/templates/registry";

type PublicProposalContentProps = {
  proposal: any;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente de votre réponse",
  WON: "✅ Acceptée",
  LOST: "❌ Refusée",
  REVISION: "⏳ En révision",
};

export function PublicProposalContent({
  proposal,
}: PublicProposalContentProps) {
  const template = getTemplate(proposal.templateId);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="p-8 bg-muted rounded-lg text-center">
          <p className="text-muted-foreground">
            Template introuvable : {proposal.templateId}
          </p>
        </div>
      </div>
    );
  }

  return <template.component data={{ ...proposal.customData, price: proposal.price }} />;
}
