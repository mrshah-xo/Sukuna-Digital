import { describe, it, expect } from 'vitest';
import { GET } from '../../app/api/admin/dashboard/route';
import { AuditLog } from '@/models';
import { mockAuthFn } from '../setup/auth-mock';
import { createSchool, createStudent, createTeacher, createAdmin } from '../setup/factories';
import { useTestDb, testDbAvailable } from '../setup/integration-hooks';
import { callRoute } from '../setup/request';

describe.skipIf(!testDbAvailable())('/api/admin/dashboard (integration)', () => {
  useTestDb();

  it('requires authentication', async () => {
    mockAuthFn.mockResolvedValue(null);
    const { status } = await callRoute(GET, 'GET', 'http://localhost/api/admin/dashboard');
    expect(status).toBe(401);
  });

  it('rejects non-admin roles', async () => {
    const school = await createSchool();
    const { session } = await createTeacher(school._id);
    mockAuthFn.mockResolvedValue(session);
    const { status } = await callRoute(GET, 'GET', 'http://localhost/api/admin/dashboard');
    expect(status).toBe(403);
  });

  it('metrics reflect only School A — no School B counts, students, teachers, or activity leak in', async () => {
    const schoolA = await createSchool({ schoolName: 'School A' });
    const schoolB = await createSchool({ schoolName: 'School B' });

    const { session: adminASession, user: adminAUser } = await createAdmin(schoolA._id);
    const { user: adminBUser } = await createAdmin(schoolB._id);

    // School A: 2 students, 1 teacher
    await createStudent(schoolA._id, { name: 'A Student 1' });
    await createStudent(schoolA._id, { name: 'A Student 2' });
    await createTeacher(schoolA._id, { name: 'A Teacher 1' });

    // School B: 5 students, 3 teachers — deliberately larger, so if
    // isolation were broken the totals would obviously be wrong.
    await createStudent(schoolB._id, { name: 'B Student 1' });
    await createStudent(schoolB._id, { name: 'B Student 2' });
    await createStudent(schoolB._id, { name: 'B Student 3' });
    await createStudent(schoolB._id, { name: 'B Student 4' });
    await createStudent(schoolB._id, { name: 'B Student 5' });
    await createTeacher(schoolB._id, { name: 'B Teacher 1' });
    await createTeacher(schoolB._id, { name: 'B Teacher 2' });
    await createTeacher(schoolB._id, { name: 'B Teacher 3' });

    // Audit log activity for both schools
    await AuditLog.create({
      schoolId: schoolA._id, userId: adminAUser._id, action: 'CREATE', resource: 'Student', timestamp: new Date(),
    });
    await AuditLog.create({
      schoolId: schoolB._id, userId: adminBUser._id, action: 'CREATE', resource: 'Student', timestamp: new Date(),
    });
    await AuditLog.create({
      schoolId: schoolB._id, userId: adminBUser._id, action: 'DELETE', resource: 'Teacher', timestamp: new Date(),
    });

    mockAuthFn.mockResolvedValue(adminASession);
    const { status, body } = await callRoute(GET, 'GET', 'http://localhost/api/admin/dashboard');

    expect(status).toBe(200);
    expect(body.data.metrics.totalStudents).toBe(2);
    expect(body.data.metrics.totalTeachers).toBe(1);

    // Only School A's single audit log entry should appear
    expect(body.data.recentActivity).toHaveLength(1);
    expect(body.data.recentActivity[0].resource).toBe('Student');
    expect(body.data.recentActivity[0].action).toBe('CREATE');

    // Explicitly confirm nothing from School B's larger dataset leaked in
    // by checking the response never mentions School B's audit action.
    const activityActions = body.data.recentActivity.map((a: { action: string }) => a.action);
    expect(activityActions).not.toContain('DELETE');
  });

  it('an empty school (no data yet) reports zeros, not an error', async () => {
    const school = await createSchool();
    const { session } = await createAdmin(school._id);
    mockAuthFn.mockResolvedValue(session);

    const { status, body } = await callRoute(GET, 'GET', 'http://localhost/api/admin/dashboard');
    expect(status).toBe(200);
    expect(body.data.metrics.totalStudents).toBe(0);
    expect(body.data.metrics.totalTeachers).toBe(0);
    expect(body.data.recentActivity).toEqual([]);
  });
});
