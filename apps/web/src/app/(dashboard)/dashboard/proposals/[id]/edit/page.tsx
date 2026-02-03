"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { TemplateEditorProvider } from "@/contexts/template-editor-context";
import { useUpdateProposal } from "@/features/proposals/hooks/use-update-proposal";
import { useUpdateStatus } from "@/features/proposals/hooks/use-update-status";
import { trpc } from "@/utils/trpc";

import { ProposalPasswordSettings } from "@/components/proposals/proposal-password-settings";
import { TemplateForm } from "@/components/proposals/template-form";
import { TemplatePreview } from "@/components/proposals/template-preview";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTemplate } from "@/templates/registry";

export default function EditProposalPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;

  const { data: proposal, isLoading } = useQuery(
    trpc.proposal.getById.queryOptions({ id: proposalId })
  );

  const updateProposal = useUpdateProposal();
  const updateStatus = useUpdateStatus();
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill data from lead
  const [initialData, setInitialData] = useState<Record<string, any>>({});
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    if (proposal && !Object.keys(initialData).length) {
      const template = getTemplate(proposal.templateId);
      if (!template) return;

      // Convert customData from Prisma Json type to plain object
      const proposalData = proposal as any;
      const prefilled: Record<string, any> = proposalData.customData
        ? JSON.parse(JSON.stringify(proposalData.customData))
        : {};

      // Pre-fill from lead data if field is empty
      template.fields.forEach((field) => {
        if (field.prefillFrom && !prefilled[field.key]) {
          const path = field.prefillFrom.split(".");
          if (path[0] === "lead" && proposalData.lead) {
            const leadKey = path[1];
            if (proposalData.lead[leadKey]) {
              prefilled[field.key] = proposalData.lead[leadKey];
            }
          }
        }
      });

      setInitialData(prefilled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal]);

  const handleSave = async (customData: Record<string, any>) => {
    setIsSaving(true);
    try {
      // Update customData and password
      const updateData: any = {
        id: proposalId,
        customData,
      };

      // Include password if it was changed
      if (password !== null) {
        updateData.password = password || undefined;
      }

      await updateProposal.mutateAsync(updateData);

      // Si la proposition était en révision, la remettre en PENDING
      if (proposal?.status === "REVISION") {
        await updateStatus.mutateAsync({
          id: proposalId,
          status: "PENDING",
        });
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-8 py-8">
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container mx-auto px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-50 mb-2">
            Proposition introuvable
          </h1>
          <Button onClick={() => router.push("/dashboard")}>Retour</Button>
        </div>
      </div>
    );
  }

  return (
    <TemplateEditorProvider
      templateId={proposal.templateId}
      initialData={initialData}
    >
      <div className="min-h-screen bg-zinc-950">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-900">
          <div className="container mx-auto py-4 px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-50">
                Édition de la proposition
              </h1>
              <p className="text-sm text-zinc-400 mt-1">{proposal.title}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={isSaving}
              >
                Annuler
              </Button>
              <SaveButton onSave={handleSave} isSaving={isSaving} />
            </div>
          </div>
        </div>

        {/* Revision Banner */}
        {proposal.status === "REVISION" && proposal.revisionMessage && (
          <div className="bg-blue-600 text-white">
            <div className="container mx-auto py-4 px-8">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💬</div>
                <div>
                  <p className="font-semibold mb-1">
                    Demande de révision du client
                  </p>
                  <p className="text-blue-50">{proposal.revisionMessage}</p>
                  <p className="text-sm text-blue-100 mt-2">
                    Lorsque vous enregistrerez, la proposition sera
                    automatiquement remise en attente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Split view */}
        <div className="container mx-auto py-8 px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <TemplateForm />
              </div>
              <ProposalPasswordSettings
                hasPassword={!!proposal.password}
                onPasswordChange={setPassword}
              />
            </div>

            {/* Preview */}
            <div>
              <TemplatePreview />
            </div>
          </div>
        </div>
      </div>
    </TemplateEditorProvider>
  );
}

function SaveButton({
  onSave,
  isSaving,
}: {
  onSave: (data: Record<string, any>) => void;
  isSaving: boolean;
}) {
  const { customData } = useTemplateEditor();

  return (
    <Button onClick={() => onSave(customData)} disabled={isSaving}>
      {isSaving ? "Enregistrement..." : "Enregistrer"}
    </Button>
  );
}

// Import useTemplateEditor at the end to avoid circular dependency
import { useTemplateEditor } from "@/contexts/template-editor-context";
