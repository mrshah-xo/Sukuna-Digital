import { describe, it, expect } from 'vitest';
import {
  ApiError,
  getSessionUser,
  requireAuth,
  requireRole,
  requireSchoolTenant,
  assertSchoolOwnership,
  validateSchoolTenant,
} from '@/lib/api-guard';
import { asUser, asUnauthenticated } from '../setup/auth-mock';

describe('api-guard: getSessionUser', () => {
  it('returns null for no session', () => {
    expect(getSessionUser(asUnauthenticated())).toBeNull();
  });

  it('returns null for a session with no user id', () => {
    // @ts-expect-error - deliberately malformed for the test
    expect(getSessionUser({ user: { role: 'ADMIN', schoolId: 's1' } })).toBeNull();
  });

  it('derives id/role/schoolId from a real session, never elsewhere', () => {
    const session = asUser({ id: 'u1', role: 'ADMIN', schoolId: 's1' });
    const user = getSessionUser(session);
    expect(user).toEqual({ id: 'u1', role: 'ADMIN', schoolId: 's1' });
  });
});

describe('api-guard: requireAuth', () => {
  it('throws a 401 ApiError when there is no session', () => {
    expect(() => requireAuth(asUnauthenticated())).toThrow(ApiError);
    try {
      requireAuth(asUnauthenticated());
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).statusCode).toBe(401);
      expect((err as ApiError).code).toBe('UNAUTHORIZED');
    }
  });

  it('returns the user for a valid session', () => {
    const session = asUser({ id: 'u1', role: 'TEACHER', schoolId: 's1' });
    expect(requireAuth(session)).toEqual({ id: 'u1', role: 'TEACHER', schoolId: 's1' });
  });
});

describe('api-guard: requireRole (RBAC)', () => {
  it('throws 403 when the role is not in the allow-list', () => {
    const student = { id: 'u1', role: 'STUDENT' as const, schoolId: 's1' };
    try {
      requireRole(student, ['ADMIN', 'PRINCIPAL']);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).statusCode).toBe(403);
      expect((err as ApiError).code).toBe('FORBIDDEN');
    }
  });

  it('throws 403 for TEACHER on an ADMIN-only endpoint', () => {
    const teacher = { id: 'u1', role: 'TEACHER' as const, schoolId: 's1' };
    expect(() => requireRole(teacher, ['ADMIN', 'PRINCIPAL'])).toThrow(ApiError);
  });

  it('allows ADMIN through', () => {
    const admin = { id: 'u1', role: 'ADMIN' as const, schoolId: 's1' };
    expect(() => requireRole(admin, ['ADMIN', 'PRINCIPAL'])).not.toThrow();
  });

  it('allows PRINCIPAL through (the role must be genuinely supported, not just accepted in the type)', () => {
    const principal = { id: 'u1', role: 'PRINCIPAL' as const, schoolId: 's1' };
    expect(() => requireRole(principal, ['ADMIN', 'PRINCIPAL'])).not.toThrow();
  });
});

describe('api-guard: requireSchoolTenant', () => {
  it('throws 403 when the user has no schoolId', () => {
    const user = { id: 'u1', role: 'ADMIN' as const, schoolId: '' };
    expect(() => requireSchoolTenant(user)).toThrow(ApiError);
  });

  it('passes when schoolId is present', () => {
    const user = { id: 'u1', role: 'ADMIN' as const, schoolId: 's1' };
    expect(() => requireSchoolTenant(user)).not.toThrow();
  });
});

describe('api-guard: assertSchoolOwnership (IDOR guard)', () => {
  it('throws 404 when the resource school does not match the session school', () => {
    const user = { id: 'u1', role: 'ADMIN' as const, schoolId: 'school-A' };
    try {
      assertSchoolOwnership('school-B', user);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      // 404, not 403 — deliberately does not reveal that the resource
      // exists in another school (avoids confirming valid-but-foreign IDs).
      expect((err as ApiError).statusCode).toBe(404);
    }
  });

  it('throws 404 when resourceSchoolId is missing/undefined', () => {
    const user = { id: 'u1', role: 'ADMIN' as const, schoolId: 'school-A' };
    expect(() => assertSchoolOwnership(undefined, user)).toThrow(ApiError);
    expect(() => assertSchoolOwnership(null, user)).toThrow(ApiError);
  });

  it('does not throw when the schools match', () => {
    const user = { id: 'u1', role: 'ADMIN' as const, schoolId: 'school-A' };
    expect(() => assertSchoolOwnership('school-A', user)).not.toThrow();
  });
});

describe('api-guard: validateSchoolTenant', () => {
  it('returns false for a mismatched schoolId', () => {
    expect(validateSchoolTenant('school-B', 'school-A')).toBe(false);
  });

  it('returns true for a matching schoolId', () => {
    expect(validateSchoolTenant('school-A', 'school-A')).toBe(true);
  });
});
