import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';

/**
 * All roles supported by the application. Single source of truth —
 * imported by api-handler.ts, middleware.ts, and route handlers so the
 * role list can never drift out of sync between authorization layers.
 */
export type Role = 'ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'DRIVER' | 'STAFF';

export interface AuthenticatedUser {
  id: string;
  role: Role;
  schoolId: string;
}

/**
 * Standard API error. Thrown from route handlers / guards and caught by
 * apiHandler() (see api-handler.ts) to produce a consistent
 * { success: false, error: { code, message } } response. Never carries
 * a stack trace or internal error details to the client.
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Derives a typed, trustworthy user identity from a NextAuth session.
 *
 * SECURITY: role / schoolId / userId must NEVER be trusted from the
 * request body, query string, or headers — only from the server-side
 * session, which NextAuth populates from the signed JWT (see
 * src/lib/auth.ts's jwt/session callbacks). This is the only function
 * in the app that should read identity off of a session object; every
 * other layer should receive an already-derived AuthenticatedUser.
 */
export function getSessionUser(session: Session | null | undefined): AuthenticatedUser | null {
  if (!session?.user?.id) return null;
  return {
    id: session.user.id as string,
    role: session.user.role as Role,
    schoolId: session.user.schoolId as string,
  };
}

/** Throws 401 if there is no authenticated session. */
export function requireAuth(session: Session | null | undefined): AuthenticatedUser {
  const user = getSessionUser(session);
  if (!user) {
    throw new ApiError(401, 'Unauthorized — Please sign in', 'UNAUTHORIZED');
  }
  return user;
}

/** Throws 403 if the user's role is not in the allowed list. */
export function requireRole(user: AuthenticatedUser, allowedRoles: Role[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new ApiError(403, `Forbidden — ${user.role} cannot access this resource`, 'FORBIDDEN');
  }
}

/** Throws 403 if the authenticated user has no school tenant assigned. */
export function requireSchoolTenant(user: AuthenticatedUser): void {
  if (!user.schoolId) {
    throw new ApiError(403, 'Forbidden — User does not belong to a valid school', 'NO_SCHOOL_TENANT');
  }
}

/**
 * IDOR guard. Verifies a loaded resource's schoolId matches the
 * authenticated user's schoolId — call this after loading any
 * resource by ID and before allowing a read/update/delete on it, so a
 * user from School A can never touch School B's data even if they
 * guess or enumerate a valid ObjectId.
 */
export function assertSchoolOwnership(
  resourceSchoolId: { toString(): string } | string | null | undefined,
  user: AuthenticatedUser
): void {
  if (!resourceSchoolId || resourceSchoolId.toString() !== user.schoolId) {
    throw new ApiError(404, 'Resource not found', 'NOT_FOUND');
  }
}

/**
 * Validates that a school id supplied in a request body matches the
 * session's school id. Kept for simple call sites; prefer deriving
 * schoolId from the session server-side entirely (never accept it from
 * the client) rather than checking it after the fact.
 */
export function validateSchoolTenant(bodySchoolId: string, sessionSchoolId: string): boolean {
  return bodySchoolId === sessionSchoolId;
}

function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: { code: error.code, message: error.message } },
      { status: error.statusCode }
    );
  }
  // Hide internal server errors (like MongoDB errors) from the client
  console.error('[API Error]:', error);
  return NextResponse.json(
    { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred on the server' } },
    { status: 500 }
  );
}

/**
 * Lightweight route guard for simple handlers that don't need Zod
 * validation. Prefer apiHandler() from api-handler.ts for routes that
 * accept a request body or query params.
 *
 * Usage:
 *   export const POST = withAuth(['ADMIN', 'TEACHER'], async (req, session, user) => { ... });
 */
export function withAuth(
  allowedRoles: Role[],
  handler: (req: Request, session: Session, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return async (req: Request) => {
    try {
      // Imported lazily to avoid a hard module-level dependency on
      // next-auth for callers that only need the pure guard functions.
      const { auth } = await import('@/lib/auth');
      const session = await auth();
      const user = requireAuth(session); // throws 401 if session/session.user is missing
      requireRole(user, allowedRoles);
      // requireAuth already guarantees session.user exists above; the
      // non-null assertion just reflects that to the type checker.
      return await handler(req, session!, user);
    } catch (error) {
      return errorResponse(error);
    }
  };
}
