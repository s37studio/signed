import { createHash } from "crypto";
import prisma from "@my-better-t-app/db";

export async function resolveMcpKey(
  apiKey: string
): Promise<{ userId: string; organizationId: string } | null> {
  const hash = createHash("sha256").update(apiKey).digest("hex");

  const record = await prisma.mcpApiKey.findUnique({
    where: { keyHash: hash },
    select: { id: true, userId: true, organizationId: true },
  });

  if (!record) return null;

  await prisma.mcpApiKey.update({
    where: { id: record.id },
    data: { lastUsedAt: new Date() },
  });

  return { userId: record.userId, organizationId: record.organizationId };
}
