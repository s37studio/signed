"use client";

import { useState } from "react";
import { getAllTemplates } from "@/templates/registry";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Code } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProposalForm } from "@/components/proposals/proposal-form";

export default function TemplatesPage() {
  const templates = getAllTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [newTemplateSheetOpen, setNewTemplateSheetOpen] = useState(false);

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);

  const getTemplateFilePath = (templateId: string) => {
    return `apps/web/src/templates/template-${templateId}.tsx`;
  };

  const openPreview = (templateId: string) => {
    setSelectedTemplate(templateId);
    setPreviewOpen(true);
  };

  return (
    <div className="flex flex-col">
      <div className="w-[96%] mx-auto pt-5 pb-8">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-zinc-50 font-sans tracking-[-0.002em]">
              Templates
            </h1>
            <p className="text-zinc-400 text-xs pt-1">
              Visualisez et modifiez vos templates de propositions
            </p>
          </div>

          <Sheet open={newTemplateSheetOpen} onOpenChange={setNewTemplateSheetOpen}>
            <SheetTrigger
              render={
                <Button className="rounded-[12px]">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau template
                </Button>
              }
            />
            <SheetContent side="right" className="sm:max-w-[600px] rounded-l-[20px] bg-[#060606] border-none pt-8 pb-8 pr-8">
              <SheetHeader>
                <SheetTitle>Ajouter un nouveau template</SheetTitle>
              </SheetHeader>
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-zinc-900/50">
                  <h3 className="font-medium text-zinc-200 mb-2">Architecture No-CMS</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Nous avons fait le choix d'une architecture sans CMS pour vous offrir une flexibilité totale.
                    Grâce à notre serveur MCP, vous pouvez générer et modifier vos templates directement dans votre codebase local.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-zinc-300">Comment créer un template ?</h4>
                  <ol className="text-sm text-zinc-400 space-y-4 list-decimal list-inside">
                    <li className="pl-2">
                      <span className="block mb-1">Créez votre composant React :</span>
                      <code className="text-xs text-zinc-300 bg-zinc-900 px-2 py-1 rounded block w-fit mt-1">
                        apps/web/src/templates/template-nom.tsx
                      </code>
                    </li>
                    <li className="pl-2">
                      <span className="block mb-1">Enregistrez-le dans le registre :</span>
                      <code className="text-xs text-zinc-300 bg-zinc-900 px-2 py-1 rounded block w-fit mt-1">
                        apps/web/src/templates/registry.ts
                      </code>
                    </li>
                  </ol>
                  <p className="text-xs text-zinc-500 italic mt-4">
                    Le template apparaîtra automatiquement dans votre dashboard une fois ces fichiers créés.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="group flex flex-col gap-3">
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-zinc-900">
                {/* Background/Preview */}
                <div className="absolute inset-0 bg-white group-hover:brightness-90 transition-all duration-200 flex items-center justify-center">
                </div>

                {/* Hover Overlay with Buttons */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                  <button
                    onClick={() => openPreview(template.id)}
                    className="size-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-200"
                    title="Aperçu"
                  >
                    <Eye className="size-5" />
                  </button>
                  <button
                    onClick={() => setNewTemplateSheetOpen(true)}
                    className="size-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-200"
                    title="Éditer"
                  >
                    <Code className="size-5" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col px-1">
                <h3 className="font-medium text-zinc-100 text-sm">
                  {template.name}
                </h3>
                <p className="text-xs text-zinc-500">Template</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Template Info */}
      </div>

      {/* Preview Dialog - Full Screen */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          showCloseButton
          className="!max-w-none !w-screen !h-screen p-0 bg-zinc-900 border-0 rounded-none top-0 left-0 translate-x-0 translate-y-0"
        >
          {selectedTemplateData && (
            <div className="overflow-auto h-full">
              <selectedTemplateData.component
                data={getExampleData(selectedTemplateData.id)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Example data for preview
function getExampleData(templateId: string) {
  if (templateId === "modern") {
    return {
      clientName: "Jean Dupont",
      companyName: "ACME Corp",
      projectTitle: "Refonte de votre site web",
      description:
        "Nous proposons une refonte complète de votre site web pour améliorer l'expérience utilisateur et augmenter vos conversions. Le projet inclut une analyse approfondie de vos besoins et une conception moderne.",
      services:
        "• Analyse et audit UX\n• Design UI moderne\n• Développement responsive\n• Optimisation SEO\n• Formation équipe",
      price: 5000,
      deliveryTime: "4 semaines",
    };
  }

  if (templateId === "classic") {
    return {
      clientName: "Marie Martin",
      companyName: "TechStart SAS",
      proposalTitle: "Refonte site web et stratégie digitale",
      introduction:
        "Suite à notre entretien du 15 janvier, nous avons le plaisir de vous présenter notre proposition pour la refonte de votre site web et l'accompagnement de votre stratégie digitale.",
      scope:
        "• Audit technique et UX du site existant\n• Conception de la nouvelle architecture\n• Design des maquettes (desktop, tablet, mobile)\n• Développement front-end et back-end\n• Migration du contenu\n• Tests et recette\n• Formation de vos équipes\n• Support post-lancement (3 mois)",
      pricing: 8000,
      timeline: "6 semaines",
    };
  }

  return {};
}
