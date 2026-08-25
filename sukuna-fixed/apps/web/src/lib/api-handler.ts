import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import type { Session } from 'next-auth';
import { auth } from '@/lib/auth';
import {
  ApiError,
  type Role,
  type AuthenticatedUser,
  getSessionUser,
  requireRole,
  requireSchoolTenant,
} from '@/lib/api-guard';

// Re-exported so existing route handlers can keep doing
// `import { apiHandler, ApiError } from '@/lib/api-handler'` — the
// canonical definitions now live in api-guard.ts.
export { ApiError } from '@/lib/api-guard';
export type { Role, AuthenticatedUser } from '@/lib/api-guard';

export interface ApiHandlerOptions<T = unknown> {
  roles?: Role[];
  schema?: ZodSchema<T>;
  requireSchoolId?: boolean; // If true, requires the session user to have a schoolId
}

export interface ApiContext<T = unknown> {
  session: Session | null;
  user: AuthenticatedUser;
  validatedData: T;
  params: Record<string, string>;
}

/**
 * Centralized API Handler Wrapper for Next.js Route Handlers.
 * Handles Authentication, RBAC, Validation, and Standardized Error Responses.
 *
 * Identity (role/schoolId/userId) is always derived from the
 * authenticated NextAuth session via api-guard.ts — never from the
 * request body or query string. See api-guard.ts for the underlying
 * auth/RBAC/IDOR primitives.
 */
export function apiHandler<T = unknown>(
  handler: (req: Request, ctx: ApiContext<T>) => Promise<NextResponse>,
  options: ApiHandlerOptions<T> = {}
) {
  return async (req: Request, { params }: { params: Record<string, string> } = { params: {} }) => {
    try {
      // 1. Authentication & RBAC (if roles specified)
      const session = await auth();
      const user: AuthenticatedUser | null = getSessionUser(session);

      if (options.roles && options.roles.length > 0) {
        if (!user) {
          throw new ApiError(401, 'Unauthorized — Please sign in', 'UNAUTHORIZED');
        }

        requireRole(user, options.roles);

        if (options.requireSchoolId) {
          requireSchoolTenant(user);
        }
      }

      // 2. Input Validation (if schema specified)
      let validatedData = {} as T;
      if (options.schema) {
        try {
          if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const body = await req.json();
            validatedData = options.schema.parse(body);
          } else if (['GET', 'DELETE'].includes(req.method)) {
            const { searchParams } = new URL(req.url);
            const queryParams = Object.fromEntries(searchParams.entries());
            validatedData = options.schema.parse(queryParams);
          }
        } catch (error) {
          if (error instanceof ZodError) {
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Invalid request data',
                  details: error.errors,
                },
              },
              { status: 400 }
            );
          }
          throw new ApiError(400, 'Invalid JSON body', 'BAD_REQUEST');
        }
      }

      // 3. Execute Handler
      const context: ApiContext<T> = {
        session,
        user: user as AuthenticatedUser,
        validatedData,
        params,
      };

      return await handler(req, context);

    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: error.code,
              message: error.message,
            },
          },
          { status: error.statusCode }
        );
      }

      // Hide internal server errors (like MongoDB errors) from the client
      console.error('[API Error]:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred on the server',
          },
        },
        { status: 500 }
      );
    }
  };
}
