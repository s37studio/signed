import dotenv from "dotenv";
import path from "node:path";
import { defineConfig } from "prisma/config";

dotenv.config({
  path: "../../apps/server/.env",
});

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    // Use dummy URL for build time when DATABASE_URL is not available
    // The actual connection will use the runtime env var
    url: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/db?schema=public",
  },
});
