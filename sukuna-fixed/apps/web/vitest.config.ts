import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    // Starts one shared in-memory MongoDB before any test file's module
    // graph loads, and injects its URI into process.env.MONGODB_URI —
    // required because src/lib/mongodb.ts reads that var at import time,
    // not lazily. Stopped again after every file finishes.
    globalSetup: ['./tests/setup/global-setup.ts'],
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    // Integration tests spin up/query a real (in-memory) MongoDB and the
    // first run needs time for mongodb-memory-server to fetch its binary.
    testTimeout: 30000,
    hookTimeout: 120000,
    include: ['tests/**/*.test.ts'],
    // All test files share the one in-memory mongod instance from
    // globalSetup, so they run sequentially in a single process rather
    // than parallel workers fighting over the same DB/global connection cache.
    pool: 'forks',
    fileParallelism: false,
  },
});
