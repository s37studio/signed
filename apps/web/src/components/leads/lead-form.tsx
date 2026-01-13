import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LeadFormProps {
  lead: {
    name: string;
    email: string;
    company: string;
    phone: string;
  };
  onLeadChange: (lead: {
    name: string;
    email: string;
    company: string;
    phone: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function LeadForm({
  lead,
  onLeadChange,
  onSubmit,
  isSubmitting,
}: LeadFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveau Lead</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={lead.name}
              onChange={(e) => onLeadChange({ ...lead, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={lead.email}
              onChange={(e) => onLeadChange({ ...lead, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="company">Entreprise</Label>
            <Input
              id="company"
              value={lead.company}
              onChange={(e) =>
                onLeadChange({ ...lead, company: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={lead.phone}
              onChange={(e) => onLeadChange({ ...lead, phone: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
