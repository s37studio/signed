import type { ComponentType } from "react";

import { TemplateClassic } from "./template-classic";
import { TemplateModern } from "./template-modern";

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
  modern: {
    id: "modern",
    name: "Moderne",
    description: "Design moderne avec gradient et cards épurées",
    thumbnail: "/templates/modern-thumb.png",
    component: TemplateModern,
    fields: [
      {
        key: "clientName",
        label: "Nom du client",
        type: "text",
        required: true,
        placeholder: "Jean Dupont",
        prefillFrom: "lead.name",
      },
      {
        key: "companyName",
        label: "Entreprise",
        type: "text",
        placeholder: "ACME Corp",
        prefillFrom: "lead.company",
      },
      {
        key: "projectTitle",
        label: "Titre du projet",
        type: "text",
        required: true,
        placeholder: "Refonte de votre site web",
      },
      {
        key: "description",
        label: "Description du projet",
        type: "textarea",
        placeholder:
          "Décrivez les objectifs et les enjeux du projet...",
      },
      {
        key: "services",
        label: "Services inclus",
        type: "textarea",
        placeholder:
          "• Analyse et audit\n• Design UX/UI\n• Développement\n• Formation",
      },
      {
        key: "price",
        label: "Prix (€)",
        type: "number",
        required: true,
        placeholder: "5000",
      },
      {
        key: "deliveryTime",
        label: "Délai de livraison",
        type: "text",
        placeholder: "4 semaines",
      },
    ],
  },

  classic: {
    id: "classic",
    name: "Classique",
    description: "Présentation formelle et professionnelle",
    thumbnail: "/templates/classic-thumb.png",
    component: TemplateClassic,
    fields: [
      {
        key: "clientName",
        label: "Nom du client",
        type: "text",
        required: true,
        placeholder: "Jean Dupont",
        prefillFrom: "lead.name",
      },
      {
        key: "companyName",
        label: "Entreprise",
        type: "text",
        placeholder: "ACME Corp",
        prefillFrom: "lead.company",
      },
      {
        key: "proposalTitle",
        label: "Titre de la proposition",
        type: "text",
        required: true,
        placeholder: "Refonte site web et stratégie digitale",
      },
      {
        key: "introduction",
        label: "Introduction",
        type: "textarea",
        placeholder:
          "Présentation du contexte et des objectifs de la proposition...",
      },
      {
        key: "scope",
        label: "Périmètre du projet",
        type: "textarea",
        placeholder: "Détaillez les livrables et prestations incluses...",
      },
      {
        key: "pricing",
        label: "Tarification (€)",
        type: "number",
        required: true,
        placeholder: "8000",
      },
      {
        key: "timeline",
        label: "Calendrier",
        type: "text",
        placeholder: "6 semaines",
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
