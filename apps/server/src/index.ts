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
    name: "Design",
    description: "Modern dark-themed design proposal with animations and case studies",
    fields: ["projectTitle", "projectDescription", "brandName", "ctaText", "acceptUrl"],
  },
  {
    id: "gtm",
    name: "GTM",
    description: "Go-to-market proposal with process phases and video section",
    fields: ["projectTitle", "projectDescription", "brandName", "videoUrl", "ctaText", "acceptUrl"],
  },
];

type McpVariables = {
  userId: string;
  organizationId: string;
};

const app = new Hono<{ Variables: McpVariables }>();

// Global error handler to return JSON errors
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json(
    {
      error: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
    500
  );
});

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE"],
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

// GET /api/mcp/proposals/revision
app.get("/api/mcp/proposals/revision", async (c) => {
  const organizationId = c.get("organizationId");
  const proposals = await proposalService.getAll(organizationId);
  return c.json(proposals.filter((p) => p.status === "REVISION"));
});

// GET /api/mcp/proposals/won
app.get("/api/mcp/proposals/won", async (c) => {
  const organizationId = c.get("organizationId");
  const proposals = await proposalService.getAll(organizationId);
  return c.json(proposals.filter((p) => p.status === "WON"));
});

// GET /api/mcp/proposals/lost
app.get("/api/mcp/proposals/lost", async (c) => {
  const organizationId = c.get("organizationId");
  const proposals = await proposalService.getAll(organizationId);
  return c.json(proposals.filter((p) => p.status === "LOST"));
});

// GET /api/mcp/proposals/pending
app.get("/api/mcp/proposals/pending", async (c) => {
  const organizationId = c.get("organizationId");
  const proposals = await proposalService.getAll(organizationId);
  return c.json(proposals.filter((p) => p.status === "PENDING"));
});

// GET /api/mcp/proposals/opened-multiple
app.get("/api/mcp/proposals/opened-multiple", async (c) => {
  const organizationId = c.get("organizationId");
  const proposals = await proposalService.getAll(organizationId);
  return c.json(proposals.filter((p) => (p._count?.views ?? 0) > 1));
});

// GET /api/mcp/proposals/recent-views
app.get("/api/mcp/proposals/recent-views", async (c) => {
  const organizationId = c.get("organizationId");
  const hoursParam = c.req.query("hours");
  const hours = hoursParam ? parseInt(hoursParam, 10) : 48;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const proposals = await proposalService.getAll(organizationId);
  return c.json(proposals.filter((p) => p.lastOpenedAt && new Date(p.lastOpenedAt) >= since));
});

// GET /api/mcp/proposals/:id
app.get("/api/mcp/proposals/:id", async (c) => {
  const organizationId = c.get("organizationId");
  const id = c.req.param("id");
  const proposal = await proposalService.getById(id, organizationId);
  const publicUrl = `${env.APP_URL}/p/${proposal.slug}`;
  return c.json({ ...proposal, publicUrl });
});

const updateProposalSchema = z.object({
  title: z.string().min(1).optional(),
  password: z.string().optional(),
  customData: z.record(z.string(), z.unknown()).optional(),
});

// PATCH /api/mcp/proposals/:id
app.patch("/api/mcp/proposals/:id", async (c) => {
  const organizationId = c.get("organizationId");
  const id = c.req.param("id");
  const raw = await c.req.json().catch(() => null);
  const parsed = updateProposalSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "Invalid body", details: parsed.error.flatten() }, 400);
  await proposalService.getById(id, organizationId);
  const updated = await proposalService.update(id, organizationId, parsed.data);
  return c.json(updated);
});

// DELETE /api/mcp/proposals/:id
app.delete("/api/mcp/proposals/:id", async (c) => {
  const organizationId = c.get("organizationId");
  const id = c.req.param("id");
  await proposalService.getById(id, organizationId);
  await proposalService.delete(id, organizationId);
  return c.json({ success: true });
});

// GET /api/mcp/leads/:id
app.get("/api/mcp/leads/:id", async (c) => {
  const organizationId = c.get("organizationId");
  const id = c.req.param("id");
  const lead = await leadService.getById(id, organizationId);
  return c.json(lead);
});

// DELETE /api/mcp/leads/:id
app.delete("/api/mcp/leads/:id", async (c) => {
  const organizationId = c.get("organizationId");
  const id = c.req.param("id");
  await leadService.getById(id, organizationId);
  await leadService.delete(id, organizationId);
  return c.json({ success: true });
});

const updateLeadSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
});

// PATCH /api/mcp/leads/:id
app.patch("/api/mcp/leads/:id", async (c) => {
  const organizationId = c.get("organizationId");
  const id = c.req.param("id");
  const raw = await c.req.json().catch(() => null);
  const parsed = updateLeadSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "Invalid body", details: parsed.error.flatten() }, 400);
  await leadService.getById(id, organizationId);
  const lead = await leadService.update(id, organizationId, parsed.data);
  return c.json(lead);
});

// GET /api/mcp/leads/:id/proposals
app.get("/api/mcp/leads/:id/proposals", async (c) => {
  const organizationId = c.get("organizationId");
  const id = c.req.param("id");
  const lead = await leadService.getById(id, organizationId);
  return c.json((lead as any).proposals ?? []);
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
    endpoint: "/trpc",
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
