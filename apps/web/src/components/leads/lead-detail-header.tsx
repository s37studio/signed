import { ArrowLeft, Mail, Building2, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

type LeadDetailHeaderProps = {
  lead: {
    id: string;
    name: string;
    email?: string | null;
    company?: string | null;
  };
};

export function LeadDetailHeader({ lead }: LeadDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/leads")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux leads
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{lead.name}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            {lead.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${lead.email}`}
                  className="hover:text-foreground"
                >
                  {lead.email}
                </a>
              </div>
            )}
            {lead.company && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{lead.company}</span>
              </div>
            )}
          </div>
        </div>

        <Link href={`/dashboard/proposals?leadId=${lead.id}`}>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Nouvelle proposition
          </Button>
        </Link>
      </div>
    </div>
  );
}
