import { env } from "@my-better-t-app/env/server";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;

// Export types for use in other packages
export * from "../prisma/generated/client";
