# Guide : Ajouter une Template

## 1. Créer le composant

```bash
apps/web/src/templates/template-nom.tsx
```

```tsx
type TemplateNomProps = {
  data: {
    champ1?: string;
    champ2?: number;
  };
};

export function TemplateNom({ data }: TemplateNomProps) {
  return (
    <div className="min-h-screen p-8">
      <h1>{data.champ1}</h1>
      <p>{data.champ2}</p>
    </div>
  );
}
```

## 2. Ajouter au registry

```typescript
// apps/web/src/templates/registry.ts

// Import
import { TemplateNom } from "./template-nom";

// Ajouter dans TEMPLATE_REGISTRY
export const TEMPLATE_REGISTRY: Record<string, Template> = {
  // ... templates existants

  nom: {
    id: "nom",
    name: "Nom",
    description: "Description",
    thumbnail: "/templates/nom-thumb.png",
    component: TemplateNom,
    fields: [
      {
        key: "champ1",
        label: "Champ 1",
        type: "text", // "text" | "textarea" | "number"
        required: true,
        placeholder: "Ex: texte",
        prefillFrom: "lead.name", // optionnel: "lead.name" | "lead.company" | "lead.email"
      },
    ],
  },
};
```

## 3. (Optionnel) Ajouter thumbnail

```bash
apps/web/public/templates/nom-thumb.png
```

---

**C'est tout !** La template est automatiquement disponible partout.
