import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/** RLS and schema tests. Needs DATABASE_URL with migrations and seed applied (npm run db:local:test). */
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./', import.meta.url)) } },
  test: {
    include: ['tests/db/**/*.test.ts'],
    environment: 'node',
    fileParallelism: false,
    testTimeout: 20_000,
  },
});
