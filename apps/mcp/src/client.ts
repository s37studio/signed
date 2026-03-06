export type ApiClient = {
  apiKey: string;
  baseUrl: string;
};

export function makeClient(apiKey: string, baseUrl: string): ApiClient {
  return { apiKey, baseUrl };
}

async function request<T>(
  client: ApiClient,
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${client.baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": client.apiKey,
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

export function listTemplates(client: ApiClient) {
  return request<{ id: string; name: string; description: string; fields: string[] }[]>(
    client,
    "GET",
    "/api/mcp/templates"
  );
}

// ─── Leads ───────────────────────────────────────────────────────────────────

export function listLeads(client: ApiClient) {
  return request<any[]>(client, "GET", "/api/mcp/leads");
}

export function createLead(
  client: ApiClient,
  data: { name: string; email?: string; company?: string; phone?: string }
) {
  return request<any>(client, "POST", "/api/mcp/leads", data);
}

// ─── Proposals ───────────────────────────────────────────────────────────────

export function listProposals(client: ApiClient) {
  return request<any[]>(client, "GET", "/api/mcp/proposals");
}

export function listProposalsNotViewed(client: ApiClient) {
  return request<any[]>(client, "GET", "/api/mcp/proposals/not-viewed");
}

export function listProposalsViewed(client: ApiClient) {
  return request<any[]>(client, "GET", "/api/mcp/proposals/viewed");
}

export function createProposal(
  client: ApiClient,
  data: {
    title: string;
    templateId: string;
    customData: Record<string, unknown>;
    leadId: string;
    password?: string;
  }
) {
  return request<any>(client, "POST", "/api/mcp/proposals", data);
}

export function updateProposalStatus(
  client: ApiClient,
  id: string,
  status: "PENDING" | "WON" | "LOST" | "REVISION"
) {
  return request<any>(client, "PATCH", `/api/mcp/proposals/${id}/status`, { status });
}
