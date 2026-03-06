import { auth } from "@my-better-t-app/auth";

export type CreateContextOptions = {
  context: any;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  const organizationId = (session?.session as any)?.activeOrganizationId ?? null;

  return {
    session,
    organizationId,
    request: context.req.raw,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
