"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProposalForm } from "@/components/proposals/proposal-form";
import { ProposalsChart } from "@/components/proposals/proposals-chart";
import { ProposalsTable } from "@/components/proposals/proposals-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useProposals } from "@/features/proposals/hooks/use-proposals";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: proposals, isLoading } = useProposals();

  if (isPending) {
    return (
      <div className="container mx-auto max-w-7xl px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-1/4 mb-4" />
          <div className="h-4 bg-zinc-800 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="w-[96%] mx-auto pt-6 pb-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-zinc-50 font-sans tracking-[-0.002em]">Activity</h1>
            <p className="text-zinc-400 text-xs pt-1">
              Retrouvez ici un aperçu de votre activité commerciale.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
              render={
                <Button className="rounded-[12px]">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle proposition
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Créer une Proposition</DialogTitle>
              </DialogHeader>
              <ProposalForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <Skeleton className="h-[200px] w-full rounded-[20px]" />
          ) : (
            <ProposalsChart proposals={proposals || []} />
          )}
        </div>
      </div>

      <div className="w-full mt-4 pb-8">
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <ProposalsTable proposals={proposals || []} />
        )}
      </div>
    </div>
  );
}
