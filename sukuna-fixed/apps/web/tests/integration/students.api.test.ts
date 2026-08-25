import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { GET, POST } from '../../app/api/admin/students/route';
import { GET as GET_ONE, PATCH, DELETE } from '../../app/api/admin/students/[id]/route';
import { User, Student } from '@/models';
import { mockAuthFn } from '../setup/auth-mock';
import { createSchool, createStudent, createTeacher, createAdmin } from '../setup/factories';
import { useTestDb, testDbAvailable } from '../setup/integration-hooks';
import { callRoute } from '../setup/request';

describe.skipIf(!testDbAvailable())('/api/admin/students (integration)', () => {
  useTestDb();

  // ---------------------------------------------------------------------
  // PART 5: Authentication & RBAC
  // ---------------------------------------------------------------------
  describe('authentication', () => {
    it('returns 401 with no session', async () => {
      mockAuthFn.mockResolvedValue(null);
      const { status, body } = await callRoute(GET, 'GET', 'http://localhost/api/admin/students');
      expect(status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('RBAC', () => {
    it('returns 403 for an authenticated STUDENT', async () => {
      const school = await createSchool();
      const { session } = await createStudent(school._id);
      mockAuthFn.mockResolvedValue(session);
      const { status, body } = await callRoute(GET, 'GET', 'http://localhost/api/admin/students');
      expect(status).toBe(403);
      expect(body.error.code).toBe('FORBIDDEN');
    });

    it('returns 403 for an authenticated TEACHER', async () => {
      const school = await createSchool();
      const { session } = await createTeacher(school._id);
      mockAuthFn.mockResolvedValue(session);
      const { status, body } = await callRoute(GET, 'GET', 'http://localhost/api/admin/students');
      expect(status).toBe(403);
      expect(body.error.code).toBe('FORBIDDEN');
    });

    it('succeeds for an authenticated ADMIN', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id);
      mockAuthFn.mockResolvedValue(session);
      const { status, body } = await callRoute(GET, 'GET', 'http://localhost/api/admin/students');
      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data.students)).toBe(true);
    });

    it('succeeds for an authenticated PRINCIPAL (routes explicitly grant this role)', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id, { role: 'PRINCIPAL' });
      mockAuthFn.mockResolvedValue(session);
      const { status, body } = await callRoute(GET, 'GET', 'http://localhost/api/admin/students');
      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // ---------------------------------------------------------------------
  // PART 6: School isolation / cross-tenant IDOR
  // ---------------------------------------------------------------------
  describe('school isolation', () => {
    it('Admin A cannot GET Student B by ID (returns 404, not the record)', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);
      const { profile: studentB } = await createStudent(schoolB._id);

      mockAuthFn.mockResolvedValue(adminASession);
      const { status, body } = await callRoute(GET_ONE, 'GET', `http://localhost/api/admin/students/${studentB._id}`, {
        params: { id: studentB._id.toString() },
      });
      expect(status).toBe(404);
      expect(body.success).toBe(false);
    });

    it('Admin A cannot PATCH Student B, and School B\'s record is unchanged', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);
      const { profile: studentB } = await createStudent(schoolB._id, { grade: '9' });

      mockAuthFn.mockResolvedValue(adminASession);
      const { status } = await callRoute(PATCH, 'PATCH', `http://localhost/api/admin/students/${studentB._id}`, {
        params: { id: studentB._id.toString() },
        body: { grade: '12' },
      });
      expect(status).toBe(404);

      const unchanged = await Student.findById(studentB._id);
      expect(unchanged?.grade).toBe('9');
    });

    it('Admin A cannot DELETE/archive Student B, and School B\'s user status is unchanged', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);
      const { profile: studentB, user: studentBUser } = await createStudent(schoolB._id);

      mockAuthFn.mockResolvedValue(adminASession);
      const { status } = await callRoute(DELETE, 'DELETE', `http://localhost/api/admin/students/${studentB._id}`, {
        params: { id: studentB._id.toString() },
      });
      expect(status).toBe(404);

      const unchanged = await User.findById(studentBUser._id);
      expect(unchanged?.status).toBe('ACTIVE');
    });

    it('the students list for Admin A never includes School B students', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);
      await createStudent(schoolA._id, { name: 'Student A1' });
      await createStudent(schoolB._id, { name: 'Student B1' });
      await createStudent(schoolB._id, { name: 'Student B2' });

      mockAuthFn.mockResolvedValue(adminASession);
      const { body } = await callRoute(GET, 'GET', 'http://localhost/api/admin/students');
      expect(body.data.students).toHaveLength(1);
      expect(body.data.pagination.total).toBe(1);
    });
  });

  // ---------------------------------------------------------------------
  // PART 7: Mass assignment (full HTTP flow, not just schema-level)
  // ---------------------------------------------------------------------
  describe('mass assignment protection', () => {
    it('a POST payload with an injected schoolId is rejected, not silently redirected into that school', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);

      mockAuthFn.mockResolvedValue(adminASession);
      const { status, body } = await callRoute(POST, 'POST', 'http://localhost/api/admin/students', {
        body: {
          name: 'Injected Student',
          phone: '9811111111',
          studentId: 'INJ-001',
          grade: '10',
          section: 'A',
          schoolId: schoolB._id.toString(),
        },
      });
      expect(status).toBe(400);
      expect(body.error.code).toBe('VALIDATION_ERROR');

      const created = await Student.findOne({ studentId: 'INJ-001' });
      expect(created).toBeNull();
    });

    it('a POST payload with an injected role field is rejected outright', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id);
      mockAuthFn.mockResolvedValue(session);

      const { status } = await callRoute(POST, 'POST', 'http://localhost/api/admin/students', {
        body: {
          name: 'Injected Admin',
          phone: '9811111112',
          studentId: 'INJ-002',
          grade: '10',
          section: 'A',
          role: 'ADMIN',
        },
      });
      expect(status).toBe(400);
      const createdUser = await User.findOne({ phone: '9811111112' });
      expect(createdUser).toBeNull();
    });

    it('a successful POST always assigns schoolId from the session, never the client', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id);
      mockAuthFn.mockResolvedValue(session);

      const { status, body } = await callRoute(POST, 'POST', 'http://localhost/api/admin/students', {
        body: { name: 'Real Student', phone: '9811111113', studentId: 'REAL-001', grade: '10', section: 'A' },
      });
      expect(status).toBe(201);
      expect(body.data.schoolId.toString()).toBe(school._id.toString());
    });
  });

  // ---------------------------------------------------------------------
  // PART 8: ID validation
  // ---------------------------------------------------------------------
  describe('ID validation', () => {
    it('a malformed ObjectId returns a controlled 400, not a crash', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id);
      mockAuthFn.mockResolvedValue(session);

      const { status, body } = await callRoute(GET_ONE, 'GET', 'http://localhost/api/admin/students/not-a-valid-id', {
        params: { id: 'not-a-valid-id' },
      });
      expect(status).toBe(400);
      expect(body.error.code).toBe('BAD_REQUEST');
      // No Mongo internals / stack trace leaked
      expect(JSON.stringify(body)).not.toMatch(/CastError|at Function|node_modules/);
    });

    it('a well-formed but non-existent ObjectId returns a controlled 404', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id);
      mockAuthFn.mockResolvedValue(session);

      const fakeId = new mongoose.Types.ObjectId().toString();
      const { status, body } = await callRoute(GET_ONE, 'GET', `http://localhost/api/admin/students/${fakeId}`, {
        params: { id: fakeId },
      });
      expect(status).toBe(404);
      expect(body.error.code).toBe('NOT_FOUND');
    });

    it('a valid ObjectId belonging to another school returns the same controlled 404 (no existence leak)', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);
      const { profile: studentB } = await createStudent(schoolB._id);

      mockAuthFn.mockResolvedValue(adminASession);
      const { status, body } = await callRoute(GET_ONE, 'GET', `http://localhost/api/admin/students/${studentB._id}`, {
        params: { id: studentB._id.toString() },
      });
      // Same 404 as a genuinely non-existent ID — a cross-school valid ID
      // does not get a distinguishable response (e.g. 403) that would
      // confirm the record's existence to an unauthorized caller.
      expect(status).toBe(404);
      expect(body.error.code).toBe('NOT_FOUND');
    });
  });

  // ---------------------------------------------------------------------
  // PART 9: Archive behavior
  // ---------------------------------------------------------------------
  describe('archive behavior', () => {
    it('archiving sets status to INACTIVE rather than physically deleting the record', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id);
      const { profile: student, user: studentUser } = await createStudent(school._id);

      mockAuthFn.mockResolvedValue(session);
      const { status, body } = await callRoute(DELETE, 'DELETE', `http://localhost/api/admin/students/${student._id}`, {
        params: { id: student._id.toString() },
      });
      expect(status).toBe(200);
      expect(body.success).toBe(true);

      const stillExists = await Student.findById(student._id);
      expect(stillExists).not.toBeNull(); // not physically deleted

      const updatedUser = await User.findById(studentUser._id);
      expect(updatedUser?.status).toBe('INACTIVE');
    });

    it('an admin cannot archive their own account', async () => {
      const school = await createSchool();
      const { session, profile: adminProfile } = await createAdmin(school._id);
      // Also enroll this same person as a "student" record pointing at
      // their own user id, to exercise the self-archive guard directly.
      const selfStudent = await Student.create({
        userId: adminProfile.userId,
        schoolId: school._id,
        studentId: 'SELF-001',
        grade: '10',
        section: 'A',
      });

      mockAuthFn.mockResolvedValue(session);
      const { status, body } = await callRoute(DELETE, 'DELETE', `http://localhost/api/admin/students/${selfStudent._id}`, {
        params: { id: selfStudent._id.toString() },
      });
      expect(status).toBe(403);
      expect(body.error.message).toMatch(/cannot archive your own account/i);
    });

    it('a STUDENT (unauthorized role) cannot archive any record', async () => {
      const school = await createSchool();
      const { session: studentSession } = await createStudent(school._id, { name: 'Attacker' });
      const { profile: victim } = await createStudent(school._id, { name: 'Victim' });

      mockAuthFn.mockResolvedValue(studentSession);
      const { status } = await callRoute(DELETE, 'DELETE', `http://localhost/api/admin/students/${victim._id}`, {
        params: { id: victim._id.toString() },
      });
      expect(status).toBe(403);
    });

    it('cross-school archive is denied (School A admin cannot archive School B student)', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);
      const { profile: studentB, user: studentBUser } = await createStudent(schoolB._id);

      mockAuthFn.mockResolvedValue(adminASession);
      const { status } = await callRoute(DELETE, 'DELETE', `http://localhost/api/admin/students/${studentB._id}`, {
        params: { id: studentB._id.toString() },
      });
      expect(status).toBe(404);

      const unchanged = await User.findById(studentBUser._id);
      expect(unchanged?.status).toBe('ACTIVE');
    });
  });
});
