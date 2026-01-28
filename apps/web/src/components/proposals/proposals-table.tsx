"use client";

import { Edit, ExternalLink } from "lucide-react";
import Link from "next/link";

import { ProposalViewsModal } from "./proposal-views-modal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_CONFIG = {
  PENDING: { label: "En attente", color: "bg-yellow-500" },
  WON: { label: "Acceptée", color: "bg-green-500" },
  LOST: { label: "Refusée", color: "bg-red-500" },
  REVISION: { label: "En révision", color: "bg-blue-500" },
};

type ProposalsTableProps = {
  proposals: any[];
};

export function ProposalsTable({ proposals }: ProposalsTableProps) {
  if (proposals.length === 0) {
    return (
      <Card className="bg-[#0E0E10] rounded-[16px] border-none">
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>Aucune proposition. Créez-en une pour commencer !</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0E0E10] rounded-[16px] border-none">
      <CardHeader>
        <CardTitle>Propositions récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Titre</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Template</TableHead>
                <TableHead className="text-center">Vues</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .map((proposal) => {
                  const statusConfig =
                    STATUS_CONFIG[
                      proposal.status as keyof typeof STATUS_CONFIG
                    ];
                  return (
                    <TableRow
                      key={proposal.id}
                      className="hover:bg-zinc-900/50"
                    >
                      <TableCell className="font-medium">
                        {proposal.title}
                        {proposal.revisionMessage && (
                          <div className="text-xs text-blue-600 mt-1">
                            💬 {proposal.revisionMessage}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/leads/${proposal.leadId}`}
                          className="hover:underline"
                        >
                          <div>{proposal.lead?.name}</div>
                          {proposal.lead?.company && (
                            <div className="text-xs text-muted-foreground">
                              {proposal.lead.company}
                            </div>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {proposal.templateId}
                      </TableCell>
                      <TableCell className="text-center">
                        <ProposalViewsModal
                          proposalId={proposal.id}
                          viewCount={proposal._count?.views || 0}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(proposal.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <a
                            href={`${window.location.origin}/p/${proposal.slug || proposal.token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                          <Link
                            href={`/dashboard/proposals/${proposal.id}/edit`}
                          >
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
