"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { LeadForm } from "@/components/leads/lead-form";
import { LeadList } from "@/components/leads/lead-list";
import { LeadListSkeleton } from "@/components/leads/lead-list-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCreateLead } from "@/features/leads/hooks/use-create-lead";
import { useDeleteLead } from "@/features/leads/hooks/use-delete-lead";
import { useUpdateLead } from "@/features/leads/hooks/use-update-lead";
import { useLeads } from "@/features/leads/hooks/use-leads";

export default function LeadsPage() {
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Custom hooks
  const leads = useLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead.mutate(newLead, {
      onSuccess: () => {
        setNewLead({ name: "", email: "", company: "", phone: "" });
        setIsDialogOpen(false);
      },
    });
  };

  const handleUpdate = (id: string, data: any) => {
    updateLead.mutate({ id, ...data });
  };

  const handleDelete = (id: string) => {
    deleteLead.mutate({ id });
  };

  return (
    <div className="flex flex-col">
      <div className="w-[96%] mx-auto pt-5 pb-0">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-zinc-50 font-sans tracking-[-0.002em]">
              Leads
            </h1>
            <p className="text-zinc-400 text-xs pt-1">Gérer vos clients potentiels</p>
          </div>
          <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <SheetTrigger
              render={
                <Button className="rounded-[12px]">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Lead
                </Button>
              }
            />
            <SheetContent side="right" className="sm:max-w-[600px] rounded-l-[20px] bg-[#060606] border-none pt-8 pb-8 pr-8">
              <SheetHeader>
                <SheetTitle>Nouveau Lead</SheetTitle>
              </SheetHeader>
              <LeadForm
                lead={newLead}
                onLeadChange={setNewLead}
                onSubmit={handleSubmit}
                isSubmitting={createLead.isPending}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="w-full mt-4 pb-8">
        {leads.isLoading && <LeadListSkeleton />}

        {leads.error && (
          <Card>
            <CardContent className="p-6">
              <p className="text-red-500">Erreur : {leads.error.message}</p>
            </CardContent>
          </Card>
        )}

        {leads.data && (
          <LeadList
            leads={leads.data}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isUpdating={updateLead.isPending}
            isDeleting={deleteLead.isPending}
          />
        )}
      </div>
    </div>
  );
}
