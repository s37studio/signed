"use client";

import { useTemplateEditor } from "@/contexts/template-editor-context";
import { getTemplate } from "@/templates/registry";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function TemplateForm() {
  const { templateId, customData, updateField } = useTemplateEditor();
  const template = getTemplate(templateId);

  if (!template) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Template non trouvé
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>

      <div className="space-y-4">
        {template.fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {field.type === "textarea" ? (
              <textarea
                id={field.key}
                value={customData[field.key] || ""}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            ) : (
              <Input
                id={field.key}
                type={field.type}
                value={customData[field.key] || ""}
                onChange={(e) => {
                  const value =
                    field.type === "number"
                      ? parseFloat(e.target.value) || 0
                      : e.target.value;
                  updateField(field.key, value);
                }}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
