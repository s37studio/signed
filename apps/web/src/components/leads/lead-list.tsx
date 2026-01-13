import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Pas besoin de typer leads[] - tRPC infère automatiquement depuis le backend !
export function LeadList({
  leads,
  onDelete,
  isDeleting,
}: {
  leads: any[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
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
        <Card key={lead.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
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
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(lead.id)}
                disabled={isDeleting}
              >
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
