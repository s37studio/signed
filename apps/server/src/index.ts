import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@my-better-t-app/api/context";
import { appRouter } from "@my-better-t-app/api/controllers/index";
import { startScheduler } from "@my-better-t-app/api";
import { proposalService } from "@my-better-t-app/api/services/proposal.service";
import { leadService } from "@my-better-t-app/api/services/lead.service";
import { auth } from "@my-better-t-app/auth";
import { env } from "@my-better-t-app/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "zod";
import { resolveMcpKey } from "./mcp-auth";

const TEMPLATES = [
  {
    id: "design",
    name: "S37 Design",
    description: "Modern dark-themed design proposal with animations and case studies",
    fields: ["projectTitle", "projectDescription", "brandName", "ctaText", "acceptUrl"],
  },
  {
    id: "gtm",
    name: "S37 GTM",
    description: "Go-to-market proposal with process phases and video section",
    fields: ["projectTitle", "projectDescription", "brandName", "videoUrl", "ctaText", "acceptUrl"],
  },
];

type McpVariables = {
  userId: string;
  organizationId: string;
};

const app = new Hono<{ Variables: McpVariables }>();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization", "X-API-Key"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// MCP routes — authentification par X-API-Key
app.use("/api/mcp/*", async (c, next) => {
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey) {
    return c.json({ error: "Missing X-API-Key header" }, 401);
  }
  const identity = await resolveMcpKey(apiKey);
  if (!identity) {
    return c.json({ error: "Invalid API key" }, 401);
  }
  c.set("userId", identity.userId);
  c.set("organizationId", identity.organizationId);
  return next();
});

// GET /api/mcp/templates
app.get("/api/mcp/templates", (c) => {
  return c.json(TEMPLATES);
});

// GET /api/mcp/leads
app.get("/api/mcp/leads", async (c) => {
  const organizationId = c.get("organizationId");
  const leads = await leadService.getAll(organizationId);
  return c.json(leads);
});

const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
});

// POST /api/mcp/leads
app.post("/api/mcp/leads", async (c) => {
  const userId = c.get("userId");
  const organizationId = c.get("organizationId");
  const raw = await c.req.json().catch(() => null);
  const parsed = createLeadSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "Invalid body", details: parsed.error.flatten() }, 400);
  const lead = await leadService.create(parsed.data, userId, organizationId);
  return c.json(lead, 201);
});

// GET /api/mcp/proposals
app.get("/api/mcp/proposals", async (c) => {
  const organizationId = c.get("organizationId");
  const proposals = await proposalService.getAll(organizationId);
  return c.json(proposals);
});

// GET /api/mcp/proposals/not-viewed
app.get("/api/mcp/proposals/not-viewed", async (c) => {
  const organizationId = c.get("organizationId");
  const proposals = await proposalService.getAll(organizationId);
  return c.json(proposals.filter((p) => !p.openedAt));
});

// GET /api/mcp/proposals/viewed
app.get("/api/mcp/proposals/viewed", async (c) => {
  const organizationId = c.get("organizationId");
  const proposals = await proposalService.getAll(organizationId);
  return c.json(proposals.filter((p) => !!p.openedAt));
});

const TEMPLATE_IDS = TEMPLATES.map((t) => t.id) as [string, ...string[]];

const createProposalSchema = z.object({
  title: z.string().min(1),
  templateId: z.enum(TEMPLATE_IDS),
  customData: z.record(z.string(), z.unknown()).optional(),
  leadId: z.string().min(1),
  password: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "WON", "LOST", "REVISION"]),
});

// POST /api/mcp/proposals
app.post("/api/mcp/proposals", async (c) => {
  const userId = c.get("userId");
  const organizationId = c.get("organizationId");
  const raw = await c.req.json().catch(() => null);
  const parsed = createProposalSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "Invalid body", details: parsed.error.flatten() }, 400);
  const proposal = await proposalService.create(
    {
      title: parsed.data.title,
      templateId: parsed.data.templateId,
      customData: parsed.data.customData ?? {},
      leadId: parsed.data.leadId,
      password: parsed.data.password,
    },
    userId,
    organizationId
  );
  const publicUrl = `${env.APP_URL}/p/${proposal.slug}`;
  return c.json({ ...proposal, publicUrl }, 201);
});

// PATCH /api/mcp/proposals/:id/status
app.patch("/api/mcp/proposals/:id/status", async (c) => {
  const organizationId = c.get("organizationId");
  const id = c.req.param("id");
  const raw = await c.req.json().catch(() => null);
  const parsed = updateStatusSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "Invalid status" }, 400);
  // Vérification IDOR : la proposition doit appartenir à cette organisation
  const proposal = await proposalService.getById(id, organizationId);
  const updated = await proposalService.updateStatus(proposal.id, parsed.data.status);
  return c.json(updated);
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

// Démarrer le scheduler de notifications
startScheduler();

export default app;
