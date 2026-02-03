"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLeads } from "@/features/leads/hooks/use-leads";
import { useCreateProposal } from "@/features/proposals/hooks/use-create-proposal";
import { getAllTemplates } from "@/templates/registry";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function ProposalForm({ initialLeadId }: { initialLeadId?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [leadId, setLeadId] = useState(initialLeadId || "");
  const [password, setPassword] = useState("");

  const { data: leads } = useLeads();
  const createProposal = useCreateProposal();
  const templates = getAllTemplates();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !templateId || !leadId) {
      return;
    }

    createProposal.mutate(
      {
        title,
        templateId,
        leadId,
        customData: {},
        password: password || undefined,
      },
      {
        onSuccess: (data) => {
          // Redirect to edit page to configure template
          router.push(`/dashboard/proposals/${data.id}/edit`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Lead */}
      <div>
        <Label htmlFor="leadId">Client</Label>
        <select
          id="leadId"
          value={leadId}
          onChange={(e) => setLeadId(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
        >
          <option value="">Sélectionner un client</option>
          {leads?.map((lead) => (
            <option key={lead.id} value={lead.id}>
              {lead.name} {lead.company ? `(${lead.company})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Titre */}
      <div>
        <Label htmlFor="title">Titre de la proposition</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Refonte site web"
          required
        />
      </div>

      {/* Template ID */}
      <div>
        <Label htmlFor="templateId">Template</Label>
        <select
          id="templateId"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
        >
          <option value="">Sélectionner un template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} - {template.description}
            </option>
          ))}
        </select>
      </div>

      {/* Password (optionnel) */}
      <div>
        <Label htmlFor="password">Mot de passe (optionnel)</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Laisser vide si pas de protection"
        />
      </div>

      <Button
        type="submit"
        disabled={createProposal.isPending}
        className="w-full"
      >
        {createProposal.isPending ? "Création..." : "Créer la proposition"}
      </Button>
    </form>
  );
}
