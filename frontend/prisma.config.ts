import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js uses .env.local — load it explicitly for Prisma CLI
config({ path: ".env.local" });
config(); // fallback to .env

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy",
  },
});