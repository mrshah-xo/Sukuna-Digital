import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Route access matrix by role
const ROLE_ROUTES: Record<string, string[]> = {
  '/admin': ['ADMIN', 'PRINCIPAL'],
  '/dashboard': ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN', 'PARENT'],
  '/live-teacher': ['STUDENT', 'TEACHER', 'ADMIN'],
  '/transport': ['STUDENT', 'PARENT', 'DRIVER', 'ADMIN'],
  '/memory': ['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for public routes
  const publicRoutes = ['/login', '/api/auth'];
  if (publicRoutes.some(r => pathname.startsWith(r))) return NextResponse.next();

  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

  if (!secret) {
    // Fail closed: never fall back to a hardcoded/known secret. Without a
    // real secret we cannot verify any token, so treat every request as
    // unauthenticated rather than silently trusting a guessable default.
    console.error('[middleware] NEXTAUTH_SECRET is not set — refusing to verify sessions.');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const token = await getToken({ req: request, secret });

  // Redirect unauthenticated users
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const userRole = token.role as string;

  // Check RBAC for protected routes
  for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
      // Redirect to their allowed dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
