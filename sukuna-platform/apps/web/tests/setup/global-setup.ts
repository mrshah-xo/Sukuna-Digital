import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Runs once, before any test file's module graph is imported. This is
 * critical: src/lib/mongodb.ts reads process.env.MONGODB_URI at MODULE
 * IMPORT time (not lazily inside connectDB()), so the real in-memory
 * server's URI must exist in process.env before any route file — which
 * imports mongodb.ts transitively — is ever imported by a test file.
 *
 * If the in-memory MongoDB binary can't be downloaded (e.g. a sandboxed
 * CI/dev environment with restricted network egress), this degrades
 * gracefully rather than crashing the whole run: process.env.MONGODB_URI
 * is left as a harmless placeholder (satisfies mongodb.ts's import-time
 * check without ever being connected to) and TEST_DB_AVAILABLE is set to
 * 'false'. Integration test files check this via testDbAvailable() and
 * skip themselves cleanly instead of failing; unit tests (which need no
 * database at all) are entirely unaffected either way.
 */
export default async function globalSetup() {
  try {
    const mongod = await MongoMemoryServer.create({
      binary: { version: '7.0.14' },
    });
    process.env.MONGODB_URI = mongod.getUri();
    process.env.TEST_DB_AVAILABLE = 'true';

    return async () => {
      await mongod.stop();
    };
  } catch (err) {
    console.warn(
      '\n[globalSetup] Could not start an in-memory MongoDB instance — ' +
        'integration tests will be skipped. This is expected in network-' +
        'restricted sandboxes; on a normal machine with internet access ' +
        'mongodb-memory-server downloads its binary and all tests run.\n' +
        'Reason: ' + (err instanceof Error ? err.message : String(err)) + '\n'
    );
    process.env.MONGODB_URI = 'mongodb://unavailable-in-this-environment/test';
    process.env.TEST_DB_AVAILABLE = 'false';
    return async () => {};
  }
}
