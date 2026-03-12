"use client";

import {
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  XCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
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
import { Card, CardContent } from "@/components/ui/card";

const STATUS_CONFIG = {
  PENDING: {
    label: "En attente",
    className: "border-[0.5px] border-zinc-800/50 text-zinc-300 px-2 py-1",
    dotClassName: "bg-amber-500",
  },
  WON: {
    label: "Acceptée",
    className: "border-[0.5px] border-zinc-800/50 text-zinc-300 px-2 py-1",
    dotClassName: "bg-emerald-500",
  },
  LOST: {
    label: "Refusée",
    className: "border-[0.5px] border-zinc-800/50 text-zinc-300 px-2 py-1",
    dotClassName: "bg-red-500",
  },
  REVISION: {
    label: "En révision",
    className: "border-[0.5px] border-zinc-800/50 text-zinc-300 px-2 py-1",
    dotClassName: "bg-blue-500",
  },
};

type ProposalsTableProps = {
  proposals: any[];
};

export function ProposalsTable({ proposals }: ProposalsTableProps) {
  if (proposals.length === 0) {
    return (
      <Card className="w-full bg-[#0E0E10] rounded-[16px] border-none">
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>Aucune proposition. Créez-en une pour commencer !</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-transparent rounded-[16px] border-none pt-0">
      <CardContent className="p-0">
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-zinc-800/30">
                <TableHead className="uppercase text-zinc-500 font-medium pl-8 tracking-[0.002em]">Titre</TableHead>
                <TableHead className="uppercase text-zinc-500 font-medium tracking-[0.002em] min-w-[180px]">Client</TableHead>
                <TableHead className="uppercase text-zinc-500 font-medium tracking-[0.002em] min-w-[100px]">Prix</TableHead>
                <TableHead className="uppercase text-zinc-500 font-medium tracking-[0.002em]">Statut</TableHead>
                <TableHead className="text-center uppercase text-zinc-500 font-medium min-w-[80px] tracking-[0.002em]">Vues</TableHead>
                <TableHead className="uppercase text-zinc-500 font-medium tracking-[0.002em]">Date</TableHead>
                <TableHead className="text-right uppercase text-zinc-500 font-medium tracking-[0.002em]" />
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
                      className="hover:bg-zinc-900/50 border-b border-zinc-800/30 cursor-pointer"
                      onClick={() =>
                        window.open(
                          `${window.location.origin}/p/${proposal.slug || proposal.token}`,
                          "_blank",
                        )
                      }
                    >
                      <TableCell className="text-[14px] pl-8">
                        {proposal.title}
                        {proposal.revisionMessage && proposal.status !== "REVISION" && (
                          <div className="text-xs text-blue-600 mt-1">
                            💬 {proposal.revisionMessage}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[180px]">
                        <Link
                          href={`/dashboard/leads/${proposal.leadId}`}
                          className="hover:no-underline"
                        >
                          <div>{proposal.lead?.name}</div>
                          {proposal.lead?.company && (
                            <div className="text-xs text-muted-foreground">
                              {proposal.lead.company}
                            </div>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground min-w-[100px]">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(proposal.customData?.price || 0)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full text-xs font-normal ${statusConfig.className}`}
                        >
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${statusConfig.dotClassName}`}
                          />
                          {statusConfig.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-center min-w-[80px]">
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
                        <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/dashboard/proposals/${proposal.id}/edit`}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-full size-9 p-0"
                              aria-label="Modifier la proposition"
                            >
                              <EllipsisVerticalIcon className="h-[18px] w-[18px]" />
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
