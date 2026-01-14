"use client";

import { useTemplateEditor } from "@/contexts/template-editor-context";
import { getTemplate } from "@/templates/registry";

export function TemplatePreview() {
  const { templateId, customData } = useTemplateEditor();
  const template = getTemplate(templateId);

  if (!template) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Template non trouvé
      </div>
    );
  }

  const TemplateComponent = template.component;

  return (
    <div className="sticky top-4">
      <div className="mb-4">
        <p className="text-sm font-medium text-muted-foreground">
          Aperçu en temps réel
        </p>
      </div>
      <div className="border rounded-lg overflow-hidden bg-background shadow-lg">
        <div className="scale-75 origin-top-left w-[133.33%]">
          <TemplateComponent data={customData} />
        </div>
      </div>
    </div>
  );
}
