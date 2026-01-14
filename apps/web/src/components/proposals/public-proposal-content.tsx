"use client";

type PublicProposalContentProps = {
  proposal: any;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente de votre réponse",
  WON: "✅ Acceptée",
  LOST: "❌ Refusée",
  REVISION: "⏳ En révision",
};

export function PublicProposalContent({ proposal }: PublicProposalContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
        <p className="text-lg text-muted-foreground">
          {STATUS_LABELS[proposal.status] || proposal.status}
        </p>
      </div>

      {/* Infos */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-3">Informations</h3>
        <div className="grid gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Date de création :</span>{" "}
            {new Date(proposal.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          {proposal.lead && (
            <div>
              <span className="text-muted-foreground">Client :</span>{" "}
              {proposal.lead.name}
              {proposal.lead.company && ` • ${proposal.lead.company}`}
            </div>
          )}
        </div>
      </div>

      {/* Template content placeholder */}
      <div className="border-t pt-6">
        <div className="p-8 bg-muted rounded-lg text-center">
          <p className="text-muted-foreground">
            Le contenu de la proposition s'affichera ici
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            (Template : {proposal.templateId})
          </p>
        </div>
      </div>
    </div>
  );
}
