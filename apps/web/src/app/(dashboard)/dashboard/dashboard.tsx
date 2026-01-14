"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useProposals } from "@/features/proposals/hooks/use-proposals";

import { ProposalsStats } from "@/components/proposals/proposals-stats";
import { ProposalsTable } from "@/components/proposals/proposals-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const { data: proposals, isLoading } = useProposals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Link href="/dashboard/proposals">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle proposition
          </Button>
        </Link>
      </div>

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
