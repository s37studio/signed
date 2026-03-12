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
        <Label htmlFor="leadId" className="mb-2 block">Client</Label>
        <div className="relative">
          <select
            id="leadId"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            className="w-full rounded-[12px] bg-zinc-900/50 pl-3 pr-10 py-2 text-sm h-10 outline-none focus:ring-1 focus:ring-zinc-700 appearance-none"
            required
          >
            <option value="">Sélectionner un client</option>
            {leads?.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.name} {lead.company ? `(${lead.company})` : ""}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      {/* Titre */}
      <div>
        <Label htmlFor="title" className="mb-2 block">Titre de la proposition</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Refonte site web"
          className="rounded-[12px] bg-zinc-900/50 border-none h-10"
          required
        />
      </div>

      {/* Template ID */}
      <div>
        <Label htmlFor="templateId" className="mb-2 block">Template</Label>
        <div className="relative">
          <select
            id="templateId"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="w-full rounded-[12px] bg-zinc-900/50 pl-3 pr-10 py-2 text-sm h-10 outline-none focus:ring-1 focus:ring-zinc-700 appearance-none"
            required
          >
            <option value="">Sélectionner un template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} - {template.description}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-zinc-800/50 my-6"></div>

      {/* Password (optionnel) */}
      <div>
        <Label htmlFor="password" className="mb-2 block">Mot de passe (optionnel)</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Laisser vide si pas de protection"
          className="rounded-[12px] bg-zinc-900/50 border-none h-10"
        />
      </div>

      <Button
        type="submit"
        disabled={createProposal.isPending}
        className="w-full rounded-[12px] text-sm h-10 mt-6"
      >
        {createProposal.isPending ? "Création..." : "Créer la proposition"}
      </Button>
    </form>
  );
}
