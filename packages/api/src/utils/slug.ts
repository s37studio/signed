/**
 * Génère un slug URL-friendly à partir d'une chaîne
 * "Acme Corp" -> "acme-corp"
 * "Jean-Marie O'Neill" -> "jean-marie-oneill"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Décompose les accents
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^\w\s-]/g, "") // Garde uniquement lettres, chiffres, espaces, tirets
    .trim()
    .replace(/\s+/g, "-") // Remplace espaces par tirets
    .replace(/-+/g, "-"); // Remplace tirets multiples par un seul
}

/**
 * Génère un token court alphanumérique (6 caractères)
 * Exemple: A3X9K2
 */
export function generateShortToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Génère le slug complet pour une proposition
 * Priorité: company > name
 */
export function generateProposalSlug(lead: {
  company?: string | null;
  name: string;
}): string {
  const baseSlug = lead.company
    ? generateSlug(lead.company)
    : generateSlug(lead.name);
  const token = generateShortToken();
  return `${baseSlug}-${token}`;
}

/**
 * Extrait le token d'un slug complet
 * "acme-corp-A3X9K2" -> "A3X9K2"
 */
export function extractTokenFromSlug(slug: string): string {
  const parts = slug.split("-");
  return parts[parts.length - 1] || "";
}
