import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { GET, POST } from '../../app/api/admin/teachers/route';
import { GET as GET_ONE, PATCH, DELETE } from '../../app/api/admin/teachers/[id]/route';
import { User, Teacher } from '@/models';
import { mockAuthFn } from '../setup/auth-mock';
import { createSchool, createTeacher, createAdmin } from '../setup/factories';
import { useTestDb, testDbAvailable } from '../setup/integration-hooks';
import { callRoute } from '../setup/request';

describe.skipIf(!testDbAvailable())('/api/admin/teachers (integration)', () => {
  useTestDb();

  describe('authentication & RBAC', () => {
    it('returns 401 with no session', async () => {
      mockAuthFn.mockResolvedValue(null);
      const { status } = await callRoute(GET, 'GET', 'http://localhost/api/admin/teachers');
      expect(status).toBe(401);
    });

    it('returns 403 for a TEACHER accessing the teachers admin list', async () => {
      const school = await createSchool();
      const { session } = await createTeacher(school._id);
      mockAuthFn.mockResolvedValue(session);
      const { status } = await callRoute(GET, 'GET', 'http://localhost/api/admin/teachers');
      expect(status).toBe(403);
    });

    it('succeeds for ADMIN and PRINCIPAL', async () => {
      const school = await createSchool();
      const { session: adminSession } = await createAdmin(school._id, { role: 'ADMIN' });
      mockAuthFn.mockResolvedValue(adminSession);
      expect((await callRoute(GET, 'GET', 'http://localhost/api/admin/teachers')).status).toBe(200);

      const { session: principalSession } = await createAdmin(school._id, { role: 'PRINCIPAL' });
      mockAuthFn.mockResolvedValue(principalSession);
      expect((await callRoute(GET, 'GET', 'http://localhost/api/admin/teachers')).status).toBe(200);
    });
  });

  describe('school isolation', () => {
    it('Admin A cannot GET Teacher B', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);
      const { profile: teacherB } = await createTeacher(schoolB._id);

      mockAuthFn.mockResolvedValue(adminASession);
      const { status } = await callRoute(GET_ONE, 'GET', `http://localhost/api/admin/teachers/${teacherB._id}`, {
        params: { id: teacherB._id.toString() },
      });
      expect(status).toBe(404);
    });

    it('Admin A cannot PATCH Teacher B, and School B\'s record is unchanged', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);
      const { profile: teacherB } = await createTeacher(schoolB._id, { subjects: ['Biology'] });

      mockAuthFn.mockResolvedValue(adminASession);
      const { status } = await callRoute(PATCH, 'PATCH', `http://localhost/api/admin/teachers/${teacherB._id}`, {
        params: { id: teacherB._id.toString() },
        body: { subjects: ['Hacked'] },
      });
      expect(status).toBe(404);

      const unchanged = await Teacher.findById(teacherB._id);
      expect(unchanged?.subjects).toEqual(['Biology']);
    });

    it('Admin A cannot DELETE/archive Teacher B', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);
      const { profile: teacherB, user: teacherBUser } = await createTeacher(schoolB._id);

      mockAuthFn.mockResolvedValue(adminASession);
      const { status } = await callRoute(DELETE, 'DELETE', `http://localhost/api/admin/teachers/${teacherB._id}`, {
        params: { id: teacherB._id.toString() },
      });
      expect(status).toBe(404);

      const unchanged = await User.findById(teacherBUser._id);
      expect(unchanged?.status).toBe('ACTIVE');
    });

    it('the teachers list for Admin A never includes School B teachers', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session: adminASession } = await createAdmin(schoolA._id);
      await createTeacher(schoolA._id, { name: 'Teacher A1' });
      await createTeacher(schoolB._id, { name: 'Teacher B1' });

      mockAuthFn.mockResolvedValue(adminASession);
      const { body } = await callRoute(GET, 'GET', 'http://localhost/api/admin/teachers');
      expect(body.data.teachers).toHaveLength(1);
    });
  });

  describe('mass assignment protection', () => {
    it('rejects an injected schoolId on create', async () => {
      const schoolA = await createSchool({ schoolName: 'School A' });
      const schoolB = await createSchool({ schoolName: 'School B' });
      const { session } = await createAdmin(schoolA._id);
      mockAuthFn.mockResolvedValue(session);

      const { status } = await callRoute(POST, 'POST', 'http://localhost/api/admin/teachers', {
        body: {
          name: 'Injected Teacher', phone: '9822222221', teacherId: 'INJ-T-001',
          schoolId: schoolB._id.toString(),
        },
      });
      expect(status).toBe(400);
      const created = await Teacher.findOne({ teacherId: 'INJ-T-001' });
      expect(created).toBeNull();
    });

    it('a successful create always assigns schoolId from the session', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id);
      mockAuthFn.mockResolvedValue(session);

      const { status, body } = await callRoute(POST, 'POST', 'http://localhost/api/admin/teachers', {
        body: { name: 'Real Teacher', phone: '9822222222', teacherId: 'REAL-T-001' },
      });
      expect(status).toBe(201);
      expect(body.data.schoolId.toString()).toBe(school._id.toString());
    });
  });

  describe('ID validation', () => {
    it('malformed ObjectId returns controlled 400', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id);
      mockAuthFn.mockResolvedValue(session);
      const { status, body } = await callRoute(GET_ONE, 'GET', 'http://localhost/api/admin/teachers/bad-id', {
        params: { id: 'bad-id' },
      });
      expect(status).toBe(400);
      expect(JSON.stringify(body)).not.toMatch(/CastError|node_modules/);
    });

    it('non-existent valid ObjectId returns controlled 404', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id);
      mockAuthFn.mockResolvedValue(session);
      const fakeId = new mongoose.Types.ObjectId().toString();
      const { status } = await callRoute(GET_ONE, 'GET', `http://localhost/api/admin/teachers/${fakeId}`, {
        params: { id: fakeId },
      });
      expect(status).toBe(404);
    });
  });

  describe('archive behavior', () => {
    it('archiving sets status to INACTIVE rather than physically deleting', async () => {
      const school = await createSchool();
      const { session } = await createAdmin(school._id);
      const { profile: teacher, user: teacherUser } = await createTeacher(school._id);

      mockAuthFn.mockResolvedValue(session);
      const { status } = await callRoute(DELETE, 'DELETE', `http://localhost/api/admin/teachers/${teacher._id}`, {
        params: { id: teacher._id.toString() },
      });
      expect(status).toBe(200);

      expect(await Teacher.findById(teacher._id)).not.toBeNull();
      expect((await User.findById(teacherUser._id))?.status).toBe('INACTIVE');
    });

    it('an admin cannot archive their own account', async () => {
      const school = await createSchool();
      const { session, profile: adminProfile } = await createAdmin(school._id);
      const selfTeacher = await Teacher.create({
        userId: adminProfile.userId,
        schoolId: school._id,
        teacherId: 'SELF-T-001',
        subjects: [],
      });

      mockAuthFn.mockResolvedValue(session);
      const { status, body } = await callRoute(DELETE, 'DELETE', `http://localhost/api/admin/teachers/${selfTeacher._id}`, {
        params: { id: selfTeacher._id.toString() },
      });
      expect(status).toBe(403);
      expect(body.error.message).toMatch(/cannot archive your own account/i);
    });
  });
});
