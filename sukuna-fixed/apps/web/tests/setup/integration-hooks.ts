import { beforeAll, afterEach } from 'vitest';
import { connectTestDb, clearTestDb } from './db';

/** Whether globalSetup managed to start a real in-memory MongoDB for this run. */
export function testDbAvailable(): boolean {
  return process.env.TEST_DB_AVAILABLE === 'true';
}

/**
 * Call this at the top of any integration test file that needs a real
 * database. The in-memory MongoDB instance itself is started once for
 * the whole run by globalSetup (tests/setup/global-setup.ts) and torn
 * down after all files finish; this just connects Mongoose (idempotent,
 * cached — see src/lib/mongodb.ts) and clears collections between tests
 * within this file so tests don't leak state into one another.
 *
 * Only call this inside a describe.skipIf(!testDbAvailable())(...) block
 * — see any file under tests/integration/ for the pattern.
 */
export function useTestDb(): void {
  beforeAll(async () => {
    await connectTestDb();
  }, 60000);

  afterEach(async () => {
    await clearTestDb();
  });
}
