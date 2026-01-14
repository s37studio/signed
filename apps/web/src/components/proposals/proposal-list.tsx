"use client";

import { ChevronDown, Trash2, Edit } from "lucide-react";
import Link from "next/link";

import { useDeleteProposal } from "@/features/proposals/hooks/use-delete-proposal";
import { useUpdateStatus } from "@/features/proposals/hooks/use-update-status";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type ProposalListProps = {
  proposals: any[];
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  WON: "Acceptée",
  LOST: "Refusée",
  REVISION: "Révision demandée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  WON: "bg-green-500/10 text-green-500",
  LOST: "bg-red-500/10 text-red-500",
  REVISION: "bg-blue-500/10 text-blue-500",
};

export function ProposalList({ proposals }: ProposalListProps) {
  const deleteProposal = useDeleteProposal();
  const updateStatus = useUpdateStatus();

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette proposition ?")) {
      deleteProposal.mutate({ id });
    }
  };

  const handleStatusChange = (
    id: string,
    status: "PENDING" | "WON" | "LOST" | "REVISION"
  ) => {
    updateStatus.mutate({ id, status });
  };

  if (proposals.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune proposition pour le moment
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">{proposal.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Client: {proposal.lead?.name || "N/A"}
                  {proposal.lead?.company && ` (${proposal.lead.company})`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    STATUS_COLORS[proposal.status] || ""
                  }`}
                >
                  {STATUS_LABELS[proposal.status] || proposal.status}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(proposal.id)}
                  disabled={deleteProposal.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Infos */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Template:</span>{" "}
                  {proposal.templateId}
                </div>
                <div>
                  <span className="text-muted-foreground">Créée le:</span>{" "}
                  {new Date(proposal.createdAt).toLocaleDateString("fr-FR")}
                </div>
                <div>
                  <span className="text-muted-foreground">Vues:</span>{" "}
                  {proposal._count?.views || 0}
                </div>
                {proposal.lastOpenedAt && (
                  <div>
                    <span className="text-muted-foreground">
                      Dernière vue:
                    </span>{" "}
                    {new Date(proposal.lastOpenedAt).toLocaleDateString(
                      "fr-FR"
                    )}
                  </div>
                )}
              </div>

              {/* Lien public */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <code className="flex-1 text-xs">
                  {typeof window !== "undefined" &&
                    `${window.location.origin}/p/${proposal.token}`}
                </code>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/p/${proposal.token}`
                    );
                  }}
                >
                  Copier
                </Button>
              </div>

              {/* Message révision */}
              {proposal.status === "REVISION" && proposal.revisionMessage && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                  <p className="text-sm font-medium text-blue-500 mb-1">
                    Message du client:
                  </p>
                  <p className="text-sm">{proposal.revisionMessage}</p>
                </div>
              )}

              {/* Actions statut */}
              <div className="flex gap-2 pt-2 border-t">
                {proposal.status === "REVISION" ? (
                  <Link
                    href={`/dashboard/proposals/${proposal.id}/edit`}
                    className="flex-1"
                  >
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Répondre à la révision
                    </Button>
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard/proposals/${proposal.id}/edit`}
                    className="flex-1"
                  >
                    <Button size="sm" variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Éditer
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        disabled={updateStatus.isPending}
                      />
                    }
                  >
                    Changer le statut <ChevronDown className="ml-2 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(proposal.id, "PENDING")
                      }
                      disabled={proposal.status === "PENDING"}
                    >
                      <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                      En attente
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(proposal.id, "WON")}
                      disabled={proposal.status === "WON"}
                    >
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                      Acceptée (Won)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(proposal.id, "LOST")}
                      disabled={proposal.status === "LOST"}
                    >
                      <span className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                      Refusée (Lost)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(proposal.id, "REVISION")
                      }
                      disabled={proposal.status === "REVISION"}
                    >
                      <span className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                      En révision
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
