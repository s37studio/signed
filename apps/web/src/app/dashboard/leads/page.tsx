"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryClient, trpc } from "@/utils/trpc";

export default function LeadsPage() {
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  // Récupérer tous les leads
  const leads = useQuery(trpc.lead.getAll.queryOptions());

  // Créer un lead
  const createLead = useMutation({
    ...trpc.lead.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "getAll"] });
      toast.success("Lead créé avec succès !");
      setNewLead({ name: "", email: "", company: "", phone: "" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Supprimer un lead
  const deleteLead = useMutation({
    ...trpc.lead.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "getAll"] });
      toast.success("Lead supprimé !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead.mutate(newLead);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Leads</h1>
        <p className="text-muted-foreground">Gérer vos clients potentiels</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulaire de création */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Nouveau Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={newLead.name}
                  onChange={(e) =>
                    setNewLead({ ...newLead, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  value={newLead.company}
                  onChange={(e) =>
                    setNewLead({ ...newLead, company: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={newLead.phone}
                  onChange={(e) =>
                    setNewLead({ ...newLead, phone: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createLead.isPending}
              >
                {createLead.isPending ? "Création..." : "Créer"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liste des leads */}
        <div className="lg:col-span-2 space-y-4">
          {leads.isLoading && (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Chargement...</p>
              </CardContent>
            </Card>
          )}

          {leads.error && (
            <Card>
              <CardContent className="p-6">
                <p className="text-red-500">Erreur : {leads.error.message}</p>
              </CardContent>
            </Card>
          )}

          {leads.data && leads.data.length === 0 && (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Aucun lead. Créez-en un pour commencer !
                </p>
              </CardContent>
            </Card>
          )}

          {leads.data?.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{lead.name}</h3>
                    {lead.company && (
                      <p className="text-sm text-muted-foreground">
                        {lead.company}
                      </p>
                    )}
                    {lead.email && (
                      <p className="text-sm text-muted-foreground">
                        {lead.email}
                      </p>
                    )}
                    {lead.phone && (
                      <p className="text-sm text-muted-foreground">
                        {lead.phone}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {lead._count.proposals} proposition(s) • Créé par{" "}
                      {lead.createdBy?.name || "Inconnu"}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteLead.mutate({ id: lead.id })}
                    disabled={deleteLead.isPending}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
