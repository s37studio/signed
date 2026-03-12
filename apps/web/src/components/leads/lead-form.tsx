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
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="mb-2 block">Nom *</Label>
        <Input
          id="name"
          value={lead.name}
          onChange={(e) => onLeadChange({ ...lead, name: e.target.value })}
          placeholder="Ex: Jean Dupont"
          className="rounded-[12px] bg-zinc-900/50 border-none h-10"
          required
        />
      </div>

      <div>
        <Label htmlFor="email" className="mb-2 block">Email</Label>
        <Input
          id="email"
          type="email"
          value={lead.email}
          onChange={(e) => onLeadChange({ ...lead, email: e.target.value })}
          placeholder="Ex: jean@entreprise.com"
          className="rounded-[12px] bg-zinc-900/50 border-none h-10"
        />
      </div>

      <div>
        <Label htmlFor="company" className="mb-2 block">Entreprise</Label>
        <Input
          id="company"
          value={lead.company}
          onChange={(e) => onLeadChange({ ...lead, company: e.target.value })}
          placeholder="Ex: Startup.co"
          className="rounded-[12px] bg-zinc-900/50 border-none h-10"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="mb-2 block">Téléphone</Label>
        <Input
          id="phone"
          value={lead.phone}
          onChange={(e) => onLeadChange({ ...lead, phone: e.target.value })}
          placeholder="Ex: +33 6 12 34 56 78"
          className="rounded-[12px] bg-zinc-900/50 border-none h-10"
        />
      </div>

      <Button type="submit" className="w-full rounded-[12px] text-sm h-10 mt-6" disabled={isSubmitting}>
        {isSubmitting ? "Création..." : "Créer"}
      </Button>
    </form>
  );
}
