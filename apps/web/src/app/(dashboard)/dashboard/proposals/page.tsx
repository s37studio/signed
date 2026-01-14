"use client";

import { useProposals } from "@/features/proposals/hooks/use-proposals";

import { ProposalForm } from "@/components/proposals/proposal-form";
import { ProposalList } from "@/components/proposals/proposal-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProposalsPage() {
  const { data: proposals, isLoading } = useProposals();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Propositions Commerciales</h1>
        <p className="text-muted-foreground mt-2">
          Créez et gérez vos propositions commerciales
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        {/* Formulaire création */}
        <div>
          <ProposalForm />
        </div>

        {/* Liste des propositions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Vos propositions</h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-[200px]" />
            </div>
          ) : (
            <ProposalList proposals={proposals || []} />
          )}
        </div>
      </div>
    </div>
  );
}
