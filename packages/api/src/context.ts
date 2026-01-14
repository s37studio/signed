import { auth } from "@my-better-t-app/auth";

export type CreateContextOptions = {
  context: any;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    session,
    request: context.req.raw,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
