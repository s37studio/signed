import Link from "next/link";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Aucun lead. Créez-en un pour commencer !
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card key={lead.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <Link
                href={`/dashboard/leads/${lead.id}`}
                className="space-y-1 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <h3 className="text-lg font-semibold">{lead.name}</h3>
                {lead.company && (
                  <p className="text-sm text-muted-foreground">
                    {lead.company}
                  </p>
                )}
                {lead.email && (
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                )}
                {lead.phone && (
                  <p className="text-sm text-muted-foreground">{lead.phone}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {lead._count.proposals} proposition(s) • Créé par{" "}
                  {lead.createdBy?.name || "Inconnu"}
                </p>
              </Link>
              <div className="flex gap-2">
                <Link href={`/dashboard/leads/${lead.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                </Link>
                <LeadEditDialog
                  lead={lead}
                  onUpdate={onUpdate}
                  isUpdating={isUpdating}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(lead.id)}
                  disabled={isDeleting}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
