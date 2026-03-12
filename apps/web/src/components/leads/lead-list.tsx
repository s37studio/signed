import Link from "next/link";
import { Edit, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { LeadEditDialog } from "./lead-edit-dialog";

export function LeadList({
  leads,
  onDelete,
  onUpdate,
  isDeleting,
  isUpdating,
}: {
  leads: any[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}) {
  if (leads.length === 0) {
    return (
      <Card className="bg-[#0E0E10] rounded-[16px] border-none">
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>Aucun lead. Créez-en un pour commencer !</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent rounded-[16px] border-none">
      <CardContent className="p-0">
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-zinc-800/50">
                <TableHead className="uppercase text-zinc-400 pl-6">Nom</TableHead>
                <TableHead className="uppercase text-zinc-400">Entreprise</TableHead>
                <TableHead className="uppercase text-zinc-400">Email</TableHead>
                <TableHead className="uppercase text-zinc-400">Téléphone</TableHead>
                <TableHead className="text-center uppercase text-zinc-400 min-w-[120px]">
                  Propositions
                </TableHead>
                <TableHead className="uppercase text-zinc-400">Créé par</TableHead>
                <TableHead className="text-right uppercase text-zinc-400"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="hover:bg-zinc-900/50 border-b border-zinc-800/50"
                >
                  <TableCell className="text-[14px] pl-6">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="hover:no-underline font-medium"
                    >
                      {lead.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {lead.company || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {lead.email || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {lead.phone || "-"}
                  </TableCell>
                  <TableCell className="text-center min-w-[120px] text-sm text-muted-foreground">
                    {lead._count.proposals}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {lead.createdBy?.name || "Inconnu"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/dashboard/leads/${lead.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full size-9 p-0"
                          aria-label="Voir le lead"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <LeadEditDialog
                        lead={lead}
                        onUpdate={onUpdate}
                        isUpdating={isUpdating}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full size-9 p-0"
                            aria-label="Modifier le lead"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full size-9 p-0 hover:bg-red-500/10 hover:text-red-500"
                        onClick={() => onDelete(lead.id)}
                        disabled={isDeleting}
                        aria-label="Supprimer le lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
