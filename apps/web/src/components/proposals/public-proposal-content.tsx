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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
        <p className="text-lg text-muted-foreground">
          {STATUS_LABELS[proposal.status] || proposal.status}
        </p>
      </div>

      {/* Template content */}
      <div className="border-t pt-6">
        {template ? (
          <template.component data={proposal.customData || {}} />
        ) : (
          <div className="p-8 bg-muted rounded-lg text-center">
            <p className="text-muted-foreground">
              Template introuvable : {proposal.templateId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
