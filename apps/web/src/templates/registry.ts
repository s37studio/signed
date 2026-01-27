import type { ComponentType } from "react";

import { TemplateDesign } from "./template-design";
import { TemplateGTM } from "./template-gtm";

export type TemplateField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number";
  required?: boolean;
  placeholder?: string;
  prefillFrom?: "lead.name" | "lead.company" | "lead.email";
};

export type Template = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  component: ComponentType<{ data: any }>;
  fields: TemplateField[];
};

export const TEMPLATE_REGISTRY: Record<string, Template> = {
  design: {
    id: "design",
    name: "S37 Design",
    description: "Modern dark-themed design proposal with animations and case studies",
    thumbnail: "/templates/design-thumb.png",
    component: TemplateDesign,
    fields: [
      {
        key: "projectTitle",
        label: "Project Title",
        type: "text",
        required: true,
        placeholder: "Website Proposal",
      },
      {
        key: "projectDescription",
        label: "Project Description",
        type: "textarea",
        placeholder: "A custom proposal crafted specifically for your project needs.",
      },
      {
        key: "brandName",
        label: "Brand Name",
        type: "text",
        placeholder: "S37™",
      },
      {
        key: "ctaText",
        label: "CTA Text",
        type: "text",
        placeholder: "Ready to get started?",
      },
      {
        key: "acceptUrl",
        label: "Accept URL",
        type: "text",
        placeholder: "#contact",
      },
    ],
  },

  gtm: {
    id: "gtm",
    name: "S37 GTM",
    description: "Go-to-market proposal with process phases and video section",
    thumbnail: "/templates/gtm-thumb.png",
    component: TemplateGTM,
    fields: [
      {
        key: "projectTitle",
        label: "Project Title",
        type: "text",
        required: true,
        placeholder: "GTM Proposal",
      },
      {
        key: "projectDescription",
        label: "Project Description",
        type: "textarea",
        placeholder: "A custom go-to-market proposal crafted specifically for your needs.",
      },
      {
        key: "brandName",
        label: "Brand Name",
        type: "text",
        placeholder: "S37™",
      },
      {
        key: "videoUrl",
        label: "Video URL (optional)",
        type: "text",
        placeholder: "https://www.youtube.com/embed/...",
      },
      {
        key: "ctaText",
        label: "CTA Text",
        type: "text",
        placeholder: "Ready to get started?",
      },
      {
        key: "acceptUrl",
        label: "Accept URL",
        type: "text",
        placeholder: "#contact",
      },
    ],
  },
};

export function getTemplate(id: string): Template | null {
  return TEMPLATE_REGISTRY[id] || null;
}

export function getAllTemplates(): Template[] {
  return Object.values(TEMPLATE_REGISTRY);
}
