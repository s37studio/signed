import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  listTemplates,
  listLeads,
  createLead,
  listProposals,
  listProposalsNotViewed,
  listProposalsViewed,
  createProposal,
  updateProposalStatus,
} from "./client.js";

if (!process.env.MCP_API_KEY) {
  console.error("Error: MCP_API_KEY environment variable is required");
  process.exit(1);
}

if (!process.env.SIGNED_API_URL) {
  console.error("Error: SIGNED_API_URL environment variable is required");
  process.exit(1);
}

const server = new McpServer({
  name: "signed-mcp",
  version: "1.0.0",
});

// ─── Templates ───────────────────────────────────────────────────────────────

server.tool(
  "list_templates",
  "Liste les templates de propositions disponibles (design, gtm, etc.)",
  {},
  async () => {
    const templates = await listTemplates();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(templates, null, 2),
        },
      ],
    };
  }
);

// ─── Leads ───────────────────────────────────────────────────────────────────

server.tool(
  "list_leads",
  "Liste tous les leads (clients) de l'organisation",
  {},
  async () => {
    const leads = await listLeads();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(leads, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "create_lead",
  "Crée un nouveau lead (client) dans l'organisation",
  {
    name: z.string().describe("Nom complet du lead"),
    email: z.string().email().optional().describe("Email du lead"),
    company: z.string().optional().describe("Nom de l'entreprise"),
    phone: z.string().optional().describe("Numéro de téléphone"),
  },
  async ({ name, email, company, phone }) => {
    const lead = await createLead({ name, email, company, phone });
    return {
      content: [
        {
          type: "text",
          text: `Lead créé avec succès :\n${JSON.stringify(lead, null, 2)}`,
        },
      ],
    };
  }
);

// ─── Proposals ───────────────────────────────────────────────────────────────

server.tool(
  "list_proposals",
  "Liste toutes les propositions de l'organisation avec leur statut et informations de vue",
  {},
  async () => {
    const proposals = await listProposals();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(proposals, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "list_proposals_not_viewed",
  "Liste les propositions qui n'ont jamais été ouvertes par le client (openedAt est null)",
  {},
  async () => {
    const proposals = await listProposalsNotViewed();
    return {
      content: [
        {
          type: "text",
          text:
            proposals.length === 0
              ? "Toutes les propositions ont été vues."
              : `${proposals.length} proposition(s) non vue(s) :\n${JSON.stringify(proposals, null, 2)}`,
        },
      ],
    };
  }
);

server.tool(
  "list_proposals_viewed",
  "Liste les propositions qui ont déjà été ouvertes par le client",
  {},
  async () => {
    const proposals = await listProposalsViewed();
    return {
      content: [
        {
          type: "text",
          text:
            proposals.length === 0
              ? "Aucune proposition n'a encore été vue."
              : `${proposals.length} proposition(s) vue(s) :\n${JSON.stringify(proposals, null, 2)}`,
        },
      ],
    };
  }
);

server.tool(
  "create_proposal",
  "Crée une nouvelle proposition pour un lead et retourne le lien public à envoyer au client",
  {
    title: z.string().describe("Titre de la proposition"),
    leadId: z.string().describe("ID du lead (client) pour qui la proposition est créée"),
    templateId: z
      .enum(["design", "gtm"])
      .describe("Template à utiliser : 'design' pour un projet de design, 'gtm' pour go-to-market"),
    customData: z
      .string()
      .optional()
      .describe(
        "Données personnalisées du template en JSON stringifié (ex: '{\"projectTitle\":\"Mon projet\",\"projectDescription\":\"Description\"}' )"
      ),
    password: z
      .string()
      .optional()
      .describe("Mot de passe optionnel pour protéger l'accès à la proposition"),
  },
  async ({ title, leadId, templateId, customData, password }) => {
    let parsedCustomData: Record<string, unknown> = {};
    if (customData) {
      try {
        parsedCustomData = JSON.parse(customData) as Record<string, unknown>;
      } catch {
        parsedCustomData = {};
      }
    }
    const proposal = await createProposal({
      title,
      leadId,
      templateId,
      customData: parsedCustomData,
      password,
    });
    return {
      content: [
        {
          type: "text",
          text: `Proposition créée avec succès !\n\nLien public à envoyer au client : ${proposal.publicUrl}\n\nDétails :\n${JSON.stringify(proposal, null, 2)}`,
        },
      ],
    };
  }
);

server.tool(
  "update_proposal_status",
  "Met à jour le statut d'une proposition (PENDING, WON, LOST, REVISION)",
  {
    id: z.string().describe("ID de la proposition à mettre à jour"),
    status: z
      .enum(["PENDING", "WON", "LOST", "REVISION"])
      .describe(
        "Nouveau statut : PENDING=en attente, WON=acceptée, LOST=perdue, REVISION=révision demandée"
      ),
  },
  async ({ id, status }) => {
    const updated = await updateProposalStatus(id, status);
    return {
      content: [
        {
          type: "text",
          text: `Statut mis à jour : ${status}\n${JSON.stringify(updated, null, 2)}`,
        },
      ],
    };
  }
);

// ─── Démarrage ────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
