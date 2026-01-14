"use client";

import { useParams, useRouter } from "next/navigation";

import { useLead } from "@/features/leads/hooks/use-lead";
import { useLeadProposals } from "@/features/leads/hooks/use-lead-proposals";

import { LeadDetailHeader } from "@/components/leads/lead-detail-header";
import { LeadProposalsHistory } from "@/components/leads/lead-proposals-history";
import { LeadStats } from "@/components/leads/lead-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const { data: lead, isLoading: leadLoading } = useLead(leadId);
  const { proposals, stats, isLoading: proposalsLoading } =
    useLeadProposals(leadId);

  if (leadLoading || proposalsLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <h1 className="text-2xl font-bold mb-2">Lead introuvable</h1>
            <Button onClick={() => router.push("/dashboard/leads")}>
              Retour aux leads
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <LeadDetailHeader lead={lead} />
      <LeadStats stats={stats} />
      <LeadProposalsHistory proposals={proposals} leadId={leadId} />
    </div>
  );
}
