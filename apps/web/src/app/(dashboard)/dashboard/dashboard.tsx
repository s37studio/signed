"use client";

import { authClient } from "@/lib/auth-client";
import { useProposals } from "@/features/proposals/hooks/use-proposals";

import { ProposalsStats } from "@/components/proposals/proposals-stats";
import { ProposalsTable } from "@/components/proposals/proposals-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const { data: proposals, isLoading } = useProposals();

  return (
    <div className="space-y-6">
      {/* Stats */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
        </div>
      ) : (
        <ProposalsStats proposals={proposals || []} />
      )}

      {/* Proposals Table */}
      {isLoading ? (
        <Skeleton className="h-[400px]" />
      ) : (
        <ProposalsTable proposals={proposals || []} />
      )}
    </div>
  );
}
