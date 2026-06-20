import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Railway may not inject DATABASE_URL during the build phase (npm ci)
    // The fallback string prevents PrismaConfigEnvError during 'npx prisma generate'
    url: process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy',
  },
});
