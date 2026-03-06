import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { Hono } from "hono";
import { serve } from "bun";
import {
  makeClient,
  listTemplates,
  listLeads,
  createLead,
  getLead,
  updateLead,
  deleteLead,
  getLeadProposals,
  updateProposal,
  listProposals,
  listProposalsNotViewed,
  listProposalsViewed,
  listProposalsRevision,
  listProposalsWon,
  listProposalsLost,
  listProposalsPending,
  listProposalsOpenedMultiple,
  listProposalsRecentViews,
  getProposal,
  deleteProposal,
  createProposal,
  updateProposalStatus,
} from "./client.js";

const SIGNED_API_URL = process.env.SIGNED_API_URL;

if (!SIGNED_API_URL) {
  console.error("Error: SIGNED_API_URL environment variable is required");
  process.exit(1);
}

function buildMcpServer(apiKey: string): McpServer {
  const client = makeClient(apiKey, SIGNED_API_URL!);
  const server = new McpServer({ name: "signed-mcp", version: "1.0.0" });

  server.tool(
    "list_templates",
    "Liste les templates de propositions disponibles (design, gtm, etc.)",
    {},
    async () => {
      const templates = await listTemplates(client);
      return {
        content: [{ type: "text", text: JSON.stringify(templates, null, 2) }],
      };
    }
  );

  server.tool(
    "list_leads",
    "Liste tous les leads (clients) de l'organisation",
    {},
    async () => {
      const leads = await listLeads(client);
      return {
        content: [{ type: "text", text: JSON.stringify(leads, null, 2) }],
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
      const lead = await createLead(client, { name, email, company, phone });
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

  server.tool(
    "list_proposals",
    "Liste toutes les propositions de l'organisation avec leur statut et informations de vue",
    {},
    async () => {
      const proposals = await listProposals(client);
      return {
        content: [{ type: "text", text: JSON.stringify(proposals, null, 2) }],
      };
    }
  );

  server.tool(
    "list_proposals_not_viewed",
    "Liste les propositions qui n'ont jamais été ouvertes par le client",
    {},
    async () => {
      const proposals = await listProposalsNotViewed(client);
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
      const proposals = await listProposalsViewed(client);
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
    "list_proposals_revision",
    "Liste les propositions pour lesquelles le client a demandé une révision (statut REVISION)",
    {},
    async () => {
      const proposals = await listProposalsRevision(client);
      return {
        content: [
          {
            type: "text",
            text:
              proposals.length === 0
                ? "Aucune proposition en attente de révision."
                : `${proposals.length} proposition(s) en révision :\n${JSON.stringify(proposals, null, 2)}`,
          },
        ],
      };
    }
  );

  server.tool(
    "list_proposals_won",
    "Liste les propositions acceptées par le client (statut WON)",
    {},
    async () => {
      const proposals = await listProposalsWon(client);
      return {
        content: [{
          type: "text",
          text: proposals.length === 0
            ? "Aucune proposition acceptée."
            : `${proposals.length} proposition(s) acceptée(s) :\n${JSON.stringify(proposals, null, 2)}`,
        }],
      };
    }
  );

  server.tool(
    "list_proposals_lost",
    "Liste les propositions perdues (statut LOST)",
    {},
    async () => {
      const proposals = await listProposalsLost(client);
      return {
        content: [{
          type: "text",
          text: proposals.length === 0
            ? "Aucune proposition perdue."
            : `${proposals.length} proposition(s) perdue(s) :\n${JSON.stringify(proposals, null, 2)}`,
        }],
      };
    }
  );

  server.tool(
    "list_proposals_pending",
    "Liste les propositions en attente de réponse du client (statut PENDING)",
    {},
    async () => {
      const proposals = await listProposalsPending(client);
      return {
        content: [{
          type: "text",
          text: proposals.length === 0
            ? "Aucune proposition en attente."
            : `${proposals.length} proposition(s) en attente :\n${JSON.stringify(proposals, null, 2)}`,
        }],
      };
    }
  );

  server.tool(
    "list_proposals_opened_multiple_times",
    "Liste les propositions ouvertes plusieurs fois par le client — signe d'un fort intérêt",
    {},
    async () => {
      const proposals = await listProposalsOpenedMultiple(client);
      return {
        content: [{
          type: "text",
          text: proposals.length === 0
            ? "Aucune proposition ouverte plusieurs fois."
            : `${proposals.length} proposition(s) très consultée(s) :\n${JSON.stringify(proposals, null, 2)}`,
        }],
      };
    }
  );

  server.tool(
    "list_proposals_recent_views",
    "Liste les propositions vues récemment par le client (par défaut dernières 48h)",
    {
      hours: z.number().optional().describe("Nombre d'heures à remonter (défaut : 48)"),
    },
    async ({ hours }) => {
      const proposals = await listProposalsRecentViews(client, hours ?? 48);
      return {
        content: [{
          type: "text",
          text: proposals.length === 0
            ? `Aucune proposition vue dans les dernières ${hours ?? 48}h.`
            : `${proposals.length} proposition(s) vues dans les dernières ${hours ?? 48}h :\n${JSON.stringify(proposals, null, 2)}`,
        }],
      };
    }
  );

  server.tool(
    "get_proposal",
    "Récupère les détails complets d'une proposition par son ID",
    {
      id: z.string().describe("ID de la proposition"),
    },
    async ({ id }) => {
      const proposal = await getProposal(client, id);
      return {
        content: [{ type: "text", text: JSON.stringify(proposal, null, 2) }],
      };
    }
  );

  server.tool(
    "update_proposal",
    "Modifie une proposition : titre, mot de passe, ou données custom",
    {
      id: z.string().describe("ID de la proposition"),
      title: z.string().min(1).optional().describe("Nouveau titre"),
      password: z.string().optional().describe("Nouveau mot de passe (chaîne vide pour le supprimer)"),
      customData: z.string().optional().describe("Nouvelles données custom en JSON stringifié"),
    },
    async ({ id, title, password, customData }) => {
      let parsedCustomData: Record<string, unknown> | undefined;
      if (customData) {
        try {
          parsedCustomData = JSON.parse(customData) as Record<string, unknown>;
        } catch {
          parsedCustomData = undefined;
        }
      }
      const updated = await updateProposal(client, id, { title, password, customData: parsedCustomData });
      return {
        content: [{ type: "text", text: `Proposition mise à jour :\n${JSON.stringify(updated, null, 2)}` }],
      };
    }
  );

  server.tool(
    "delete_proposal",
    "Supprime définitivement une proposition",
    {
      id: z.string().describe("ID de la proposition à supprimer"),
    },
    async ({ id }) => {
      await deleteProposal(client, id);
      return {
        content: [{ type: "text", text: `Proposition ${id} supprimée.` }],
      };
    }
  );

  server.tool(
    "get_lead",
    "Récupère les détails complets d'un lead par son ID, incluant ses propositions",
    {
      id: z.string().describe("ID du lead"),
    },
    async ({ id }) => {
      const lead = await getLead(client, id);
      return {
        content: [{ type: "text", text: JSON.stringify(lead, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_lead",
    "Supprime définitivement un lead et toutes ses propositions",
    {
      id: z.string().describe("ID du lead à supprimer"),
    },
    async ({ id }) => {
      await deleteLead(client, id);
      return {
        content: [{ type: "text", text: `Lead ${id} supprimé.` }],
      };
    }
  );

  server.tool(
    "update_lead",
    "Modifie les informations d'un lead (nom, email, entreprise, téléphone)",
    {
      id: z.string().describe("ID du lead"),
      name: z.string().min(1).optional().describe("Nouveau nom"),
      email: z.string().email().optional().describe("Nouvel email"),
      company: z.string().optional().describe("Nouvelle entreprise"),
      phone: z.string().optional().describe("Nouveau téléphone"),
    },
    async ({ id, name, email, company, phone }) => {
      const lead = await updateLead(client, id, { name, email, company, phone });
      return {
        content: [{ type: "text", text: `Lead mis à jour :\n${JSON.stringify(lead, null, 2)}` }],
      };
    }
  );

  server.tool(
    "get_lead_proposals",
    "Liste toutes les propositions envoyées à un lead spécifique",
    {
      id: z.string().describe("ID du lead"),
    },
    async ({ id }) => {
      const proposals = await getLeadProposals(client, id);
      return {
        content: [{
          type: "text",
          text: proposals.length === 0
            ? "Ce lead n'a aucune proposition."
            : `${proposals.length} proposition(s) pour ce lead :\n${JSON.stringify(proposals, null, 2)}`,
        }],
      };
    }
  );

  server.tool(
    "create_proposal",
    "Crée une nouvelle proposition pour un lead et retourne le lien public à envoyer au client",
    {
      title: z.string().describe("Titre de la proposition"),
      leadId: z
        .string()
        .describe("ID du lead pour qui la proposition est créée"),
      templateId: z
        .enum(["design", "gtm"])
        .describe(
          "Template : 'design' pour un projet de design, 'gtm' pour go-to-market"
        ),
      customData: z
        .string()
        .optional()
        .describe(
          'Données du template en JSON stringifié (ex: \'{"projectTitle":"Mon projet","projectDescription":"Description"}\')'
        ),
      password: z
        .string()
        .optional()
        .describe("Mot de passe optionnel pour protéger la proposition"),
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
      const proposal = await createProposal(client, {
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
            text: `Proposition créée !\n\nLien public : ${proposal.publicUrl as string}\n\nDétails :\n${JSON.stringify(proposal, null, 2)}`,
          },
        ],
      };
    }
  );

  server.tool(
    "update_proposal_status",
    "Met à jour le statut d'une proposition (PENDING, WON, LOST, REVISION)",
    {
      id: z.string().describe("ID de la proposition"),
      status: z
        .enum(["PENDING", "WON", "LOST", "REVISION"])
        .describe(
          "Statut : PENDING=en attente, WON=acceptée, LOST=perdue, REVISION=révision demandée"
        ),
    },
    async ({ id, status }) => {
      const updated = await updateProposalStatus(client, id, status);
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

  return server;
}

// ─── Hono HTTP server ─────────────────────────────────────────────────────────

const app = new Hono();

app.get("/", (c) => c.text("Signed MCP Server"));
app.get("/health", (c) => c.json({ status: "ok" }));

app.all("/mcp", async (c) => {
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey) {
    return c.json({ error: "Missing X-API-Key header" }, 401);
  }

  const mcpServer = buildMcpServer(apiKey);

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await mcpServer.connect(transport);

  const response = await transport.handleRequest(c.req.raw);
  return response;
});

const PORT = Number(process.env.PORT ?? 3002);

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`Signed MCP Server running on port ${PORT}`);
