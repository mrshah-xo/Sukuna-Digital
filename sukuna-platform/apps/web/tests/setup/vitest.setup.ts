import { vi, afterEach } from 'vitest';
import { mockAuthFn } from './auth-mock';

// Mock next-auth's session getter for every test file. Route handlers
// import `auth` from '@/lib/auth' and call `await auth()` — this is the
// ONLY thing that determines the caller's identity (see api-guard.ts),
// so controlling it here lets tests simulate any role/school/unauthenticated
// caller without a real NextAuth JWT/cookie round-trip.
vi.mock('@/lib/auth', () => ({
  auth: mockAuthFn,
  handlers: { GET: vi.fn(), POST: vi.fn() },
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

afterEach(() => {
  mockAuthFn.mockReset();
});

// Deliberately NOT starting an in-memory MongoDB here: most unit tests
// (api-guard, Zod schema validation) need no database at all and
// shouldn't pay for or depend on one. Integration tests that do need a
// real database opt in explicitly via useTestDb() (see integration-hooks.ts).
