"use client";

import { useState } from "react";
import { getAllTemplates } from "@/templates/registry";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Code } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function TemplatesPage() {
  const templates = getAllTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);

  const getTemplateFilePath = (templateId: string) => {
    return `apps/web/src/templates/template-${templateId}.tsx`;
  };

  const openPreview = (templateId: string) => {
    setSelectedTemplate(templateId);
    setPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-medium text-zinc-50 font-display mb-2">
            Templates
          </h1>
          <p className="text-zinc-400">
            Visualisez et modifiez vos templates de propositions
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-6xl mb-2">
                      {template.id === "modern" ? "🎨" : "📄"}
                    </div>
                    <p className="text-sm text-zinc-500">Preview</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  {template.description}
                </p>

                {/* File Path */}
                <div className="mb-4 p-3 bg-zinc-950 rounded border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Fichier:</p>
                  <code className="text-xs text-zinc-300 break-all">
                    {getTemplateFilePath(template.id)}
                  </code>
                </div>

                {/* Fields Info */}
                <div className="mb-4">
                  <p className="text-xs text-zinc-500 mb-2">
                    {template.fields.length} champs configurables
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 3).map((field) => (
                      <span
                        key={field.key}
                        className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded"
                      >
                        {field.label}
                      </span>
                    ))}
                    {template.fields.length > 3 && (
                      <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                        +{template.fields.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                    onClick={() => openPreview(template.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                    onClick={() => {
                      // This will be handled by Cursor - just show the path
                      alert(
                        `Ouvrez ce fichier dans votre éditeur:\n\n${getTemplateFilePath(template.id)}`,
                      );
                    }}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Éditer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add New Template Info */}
        <Card className="mt-8 bg-zinc-900 border-zinc-800 p-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Code className="h-5 w-5" />
            Ajouter un nouveau template
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Pour créer un nouveau template, suivez le guide dans{" "}
            <code className="text-zinc-300 bg-zinc-950 px-2 py-1 rounded">
              apps/web/src/templates/GUIDE.md
            </code>
          </p>
          <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
            <li>
              Créer un nouveau fichier{" "}
              <code className="text-zinc-300 bg-zinc-950 px-2 py-1 rounded">
                template-nom.tsx
              </code>
            </li>
            <li>
              Ajouter le composant au{" "}
              <code className="text-zinc-300 bg-zinc-950 px-2 py-1 rounded">
                registry.ts
              </code>
            </li>
            <li>Le template sera automatiquement disponible</li>
          </ol>
        </Card>
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
