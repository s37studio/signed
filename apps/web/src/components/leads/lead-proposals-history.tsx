"use client";

import { Calendar, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ProposalViewsModal } from "../proposals/proposal-views-modal";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ProposalForm } from "../proposals/proposal-form";

const STATUS_CONFIG = {
  PENDING: {
    label: "En attente",
    className: "bg-[#0E0E10] text-white px-2 py-1",
    dotClassName: "bg-amber-500",
  },
  WON: {
    label: "Acceptée",
    className: "bg-[#0E0E10] text-white px-2 py-1",
    dotClassName: "bg-emerald-500",
  },
  LOST: {
    label: "Refusée",
    className: "bg-[#0E0E10] text-white px-2 py-1",
    dotClassName: "bg-red-500",
  },
  REVISION: {
    label: "En révision",
    className: "bg-[#0E0E10] text-white px-2 py-1",
    dotClassName: "bg-blue-500",
  },
};

type LeadProposalsHistoryProps = {
  proposals: any[];
  leadId: string;
};

export function LeadProposalsHistory({
  proposals,
  leadId,
}: LeadProposalsHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger
                render={
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer la première proposition
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Créer une Proposition</DialogTitle>
                </DialogHeader>
                <ProposalForm initialLeadId={leadId} />
              </DialogContent>
            </Dialog>
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
                          className={`inline-flex items-center gap-1.5 rounded-full text-xs font-normal ${statusConfig.className}`}
                        >
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${statusConfig.dotClassName}`}
                          />
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground items-center">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(proposal.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </div>
                        <div>Template: {proposal.templateId}</div>
                        <div className="flex items-center gap-2">
                          <span>Vues:</span>
                          <ProposalViewsModal
                            proposalId={proposal.id}
                            viewCount={proposal._count?.views || 0}
                          />
                        </div>
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
                      <a
                        href={
                          typeof window !== "undefined"
                            ? `${window.location.origin}/p/${
                                proposal.slug || proposal.token
                              }`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline">
                          Voir
                        </Button>
                      </a>
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
