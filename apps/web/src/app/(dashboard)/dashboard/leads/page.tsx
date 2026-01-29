"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { LeadForm } from "@/components/leads/lead-form";
import { LeadList } from "@/components/leads/lead-list";
import { LeadListSkeleton } from "@/components/leads/lead-list-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    <div className="container mx-auto max-w-7xl px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-medium text-zinc-50 font-display">
            Leads
          </h1>
          <p className="text-zinc-400">Gérer vos clients potentiels</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button className="rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Lead
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau Lead</DialogTitle>
            </DialogHeader>
            <LeadForm
              lead={newLead}
              onLeadChange={setNewLead}
              onSubmit={handleSubmit}
              isSubmitting={createLead.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {/* Liste des leads */}
        <div>
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
    </div>
  );
}
