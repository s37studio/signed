import { Calendar, FileText } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const STATUS_CONFIG = {
  PENDING: { label: "En attente", color: "bg-yellow-500" },
  WON: { label: "Acceptée", color: "bg-green-500" },
  LOST: { label: "Refusée", color: "bg-red-500" },
  REVISION: { label: "En révision", color: "bg-blue-500" },
};

type LeadProposalsHistoryProps = {
  proposals: any[];
  leadId: string;
};

export function LeadProposalsHistory({
  proposals,
  leadId,
}: LeadProposalsHistoryProps) {
  if (proposals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des propositions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Aucune proposition envoyée à ce lead</p>
            <Link href={`/dashboard/proposals?leadId=${leadId}`}>
              <Button className="mt-4">Créer la première proposition</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des propositions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {proposals
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((proposal) => {
              const statusConfig =
                STATUS_CONFIG[proposal.status as keyof typeof STATUS_CONFIG];
              return (
                <div
                  key={proposal.id}
                  className="border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {proposal.title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium text-white ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(proposal.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </div>
                        <div>Template: {proposal.templateId}</div>
                        <div>Vues: {proposal.viewCount}</div>
                        {proposal.lastOpenedAt && (
                          <div>
                            Dernière vue:{" "}
                            {new Date(proposal.lastOpenedAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </div>
                        )}
                      </div>

                      {proposal.revisionMessage && (
                        <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-sm">
                          <span className="font-medium text-blue-600">
                            Message du client:
                          </span>{" "}
                          {proposal.revisionMessage}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`http://localhost:3001/p/${proposal.token}`}
                        target="_blank"
                      >
                        <Button size="sm" variant="outline">
                          Voir
                        </Button>
                      </Link>
                      <Link href={`/dashboard/proposals/${proposal.id}/edit`}>
                        <Button size="sm" variant="outline">
                          Éditer
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
