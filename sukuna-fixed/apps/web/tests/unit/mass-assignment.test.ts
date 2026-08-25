import { describe, it, expect } from 'vitest';
import { 
  createStudentSchema, 
  updateStudentSchema, 
  createTeacherSchema, 
  updateTeacherSchema 
} from '../../src/lib/admin-schemas';

// These import and test the EXACT schema objects the live routes use
// (not a reimplemented copy), so a future edit that weakens validation
// on the real route would fail these tests too.

describe('mass-assignment protection: student create', () => {
  const validPayload = { name: 'Ram Shrestha', phone: '9800011111', studentId: 'STU-001', grade: '10', section: 'A' };

  it('accepts a well-formed payload with only the intended fields', () => {
    expect(createStudentSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects an injected schoolId (cross-school mass assignment attempt)', () => {
    const result = createStudentSchema.safeParse({ ...validPayload, schoolId: 'some-other-school-id' });
    expect(result.success).toBe(false);
  });

  it('rejects an injected role field (privilege escalation attempt)', () => {
    const result = createStudentSchema.safeParse({ ...validPayload, role: 'ADMIN' });
    expect(result.success).toBe(false);
  });

  it('rejects an injected status field not in the create contract', () => {
    const result = createStudentSchema.safeParse({ ...validPayload, status: 'ACTIVE' });
    expect(result.success).toBe(false);
  });

  it('rejects an injected userId (attempting to link to an arbitrary existing user)', () => {
    const result = createStudentSchema.safeParse({ ...validPayload, userId: '507f1f77bcf86cd799439011' });
    expect(result.success).toBe(false);
  });
});

describe('mass-assignment protection: student update', () => {
  it('accepts a partial, well-formed update', () => {
    expect(updateStudentSchema.safeParse({ grade: '11' }).success).toBe(true);
  });

  it('rejects an injected schoolId on update (cannot move a student to another school via PATCH)', () => {
    const result = updateStudentSchema.safeParse({ grade: '11', schoolId: 'other-school' });
    expect(result.success).toBe(false);
  });

  it('rejects an injected role field on update', () => {
    const result = updateStudentSchema.safeParse({ role: 'ADMIN' });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown/unexpected field entirely', () => {
    const result = updateStudentSchema.safeParse({ isSuperAdmin: true });
    expect(result.success).toBe(false);
  });

  it('only accepts the documented status enum values', () => {
    expect(updateStudentSchema.safeParse({ status: 'ACTIVE' }).success).toBe(true);
    expect(updateStudentSchema.safeParse({ status: 'DELETED_PERMANENTLY' }).success).toBe(false);
  });
});

describe('mass-assignment protection: teacher create', () => {
  const validPayload = { name: 'Sita Gurung', phone: '9800022222', teacherId: 'TCH-001', subjects: ['Math'] };

  it('accepts a well-formed payload', () => {
    expect(createTeacherSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects an injected schoolId', () => {
    expect(createTeacherSchema.safeParse({ ...validPayload, schoolId: 'other-school' }).success).toBe(false);
  });

  it('rejects an injected role field (privilege escalation attempt)', () => {
    expect(createTeacherSchema.safeParse({ ...validPayload, role: 'ADMIN' }).success).toBe(false);
  });
});

describe('mass-assignment protection: teacher update', () => {
  it('accepts a partial, well-formed update', () => {
    expect(updateTeacherSchema.safeParse({ subjects: ['Physics'] }).success).toBe(true);
  });

  it('rejects an injected schoolId on update', () => {
    expect(updateTeacherSchema.safeParse({ schoolId: 'other-school' }).success).toBe(false);
  });

  it('rejects an injected role field on update', () => {
    expect(updateTeacherSchema.safeParse({ role: 'ADMIN' }).success).toBe(false);
  });
});
