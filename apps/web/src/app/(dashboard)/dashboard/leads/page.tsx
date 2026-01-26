"use client";

import { useState } from "react";

import { LeadForm } from "@/components/leads/lead-form";
import { LeadList } from "@/components/leads/lead-list";
import { LeadListSkeleton } from "@/components/leads/lead-list-skeleton";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-50">Leads</h1>
        <p className="text-zinc-400">Gérer vos clients potentiels</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulaire de création */}
        <div className="lg:col-span-1">
          <LeadForm
            lead={newLead}
            onLeadChange={setNewLead}
            onSubmit={handleSubmit}
            isSubmitting={createLead.isPending}
          />
        </div>

        {/* Liste des leads */}
        <div className="lg:col-span-2">
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
