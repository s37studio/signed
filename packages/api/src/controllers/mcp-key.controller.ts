import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import prisma from "@my-better-t-app/db";
import { TRPCError } from "@trpc/server";

import { orgProcedure, router } from "../index";

function generateApiKey(): string {
  const bytes = randomBytes(32);
  return `sk_mcp_${bytes.toString("hex")}`;
}

function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export const mcpKeyController = router({
  listKeys: orgProcedure.query(async ({ ctx }) => {
    return await prisma.mcpApiKey.findMany({
      where: { organizationId: ctx.organizationId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsedAt: true,
        userId: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  createKey: orgProcedure
    .input(z.object({ name: z.string().min(1, "Le nom est requis") }))
    .mutation(async ({ input, ctx }) => {
      const plainKey = generateApiKey();
      const keyHash = hashApiKey(plainKey);

      await prisma.mcpApiKey.create({
        data: {
          name: input.name,
          keyHash,
          userId: ctx.session.user.id,
          organizationId: ctx.organizationId,
        },
      });

      return { key: plainKey };
    }),

  deleteKey: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await prisma.mcpApiKey.findFirst({
        where: { id: input.id, organizationId: ctx.organizationId },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "API key not found" });
      }

      await prisma.mcpApiKey.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
