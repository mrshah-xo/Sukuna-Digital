import { vi } from 'vitest';
import type { Session } from 'next-auth';

/**
 * Route handlers get their identity exclusively from `await auth()`
 * (see src/lib/api-guard.ts's getSessionUser / src/lib/api-handler.ts) —
 * never from the request body. Mocking this one function is therefore
 * sufficient to simulate any authenticated (or unauthenticated) caller
 * for every admin API route, without needing a real NextAuth session/JWT.
 */
export const mockAuthFn = vi.fn<() => Promise<Session | null>>();

export interface TestSessionUser {
  id: string;
  role: 'ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'DRIVER' | 'STAFF';
  schoolId: string;
  phone?: string;
  name?: string;
}

/** Builds a fully-shaped Session object matching the next-auth.d.ts augmentation. */
export function asUser(user: TestSessionUser): Session {
  return {
    user: {
      id: user.id,
      name: user.name ?? 'Test User',
      email: null,
      image: null,
      phone: user.phone ?? '9800000000',
      role: user.role,
      schoolId: user.schoolId,
    },
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}

/** Simulates an unauthenticated request (no session). */
export function asUnauthenticated(): null {
  return null;
}
