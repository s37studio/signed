const API_URL = process.env.SIGNED_API_URL ?? "http://localhost:3001";
const API_KEY = process.env.MCP_API_KEY ?? "";

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─── Templates ───────────────────────────────────────────────────────────────

export function listTemplates() {
  return request<{ id: string; name: string; description: string; fields: string[] }[]>(
    "GET",
    "/api/mcp/templates"
  );
}

// ─── Leads ───────────────────────────────────────────────────────────────────

export function listLeads() {
  return request<any[]>("GET", "/api/mcp/leads");
}

export function createLead(data: {
  name: string;
  email?: string;
  company?: string;
  phone?: string;
}) {
  return request<any>("POST", "/api/mcp/leads", data);
}

// ─── Proposals ───────────────────────────────────────────────────────────────

export function listProposals() {
  return request<any[]>("GET", "/api/mcp/proposals");
}

export function listProposalsNotViewed() {
  return request<any[]>("GET", "/api/mcp/proposals/not-viewed");
}

export function listProposalsViewed() {
  return request<any[]>("GET", "/api/mcp/proposals/viewed");
}

export function createProposal(data: {
  title: string;
  templateId: string;
  customData: Record<string, unknown>;
  leadId: string;
  password?: string;
}) {
  return request<any>("POST", "/api/mcp/proposals", data);
}

export function updateProposalStatus(
  id: string,
  status: "PENDING" | "WON" | "LOST" | "REVISION"
) {
  return request<any>("PATCH", `/api/mcp/proposals/${id}/status`, { status });
}
