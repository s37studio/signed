"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

import Dashboard from "./dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login");
      return;
    }
    const activeOrg = (session as any)?.session?.activeOrganizationId ?? (session as any)?.activeOrganizationId;
    if (!activeOrg) {
      console.log("[dashboard] no active org, redirecting to onboarding");
      router.push("/onboarding" as any);
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="container mx-auto max-w-7xl px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-medium text-zinc-50 font-display">
            Dashboard
          </h1>
          <p className="text-zinc-400 text-sm pt-1">
            Retrouvez ici un aperçu de votre activité commerciale.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button className="rounded-full">
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
      <Dashboard session={session} />
    </div>
  );
}
