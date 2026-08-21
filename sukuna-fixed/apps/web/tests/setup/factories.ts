import mongoose from 'mongoose';
import { School, User, Student, Teacher, Admin } from '@/models';
import type { ISchool, IUser, IStudent, ITeacher, IAdmin } from '@/models';
import { asUser, type TestSessionUser } from './auth-mock';
import type { Session } from 'next-auth';

let phoneCounter = 9800000000;
function nextPhone(): string {
  phoneCounter += 1;
  return String(phoneCounter);
}

export async function createSchool(overrides: Partial<ISchool> = {}) {
  return School.create({
    schoolName: 'Test School',
    schoolCode: `SCH-${new mongoose.Types.ObjectId().toString().slice(-6)}`,
    status: 'ACTIVE',
    ...overrides,
  });
}

interface CreatePersonResult<TProfile> {
  user: IUser;
  profile: TProfile;
  session: Session;
}

/** Creates a User + Student profile pair belonging to the given school. */
export async function createStudent(
  schoolId: mongoose.Types.ObjectId,
  overrides: { name?: string; studentId?: string; grade?: string; section?: string; status?: IUser['status'] } = {}
): Promise<CreatePersonResult<IStudent>> {
  const user = await User.create({
    schoolId,
    name: overrides.name ?? 'Test Student',
    phone: nextPhone(),
    role: 'STUDENT',
    status: overrides.status ?? 'ACTIVE',
  });
  const profile = await Student.create({
    userId: user._id,
    schoolId,
    studentId: overrides.studentId ?? `STU-${new mongoose.Types.ObjectId().toString().slice(-6)}`,
    grade: overrides.grade ?? '10',
    section: overrides.section ?? 'A',
  });
  const session = asUser({ id: user._id.toString(), role: 'STUDENT', schoolId: schoolId.toString(), name: user.name });
  return { user, profile, session };
}

/** Creates a User + Teacher profile pair belonging to the given school. */
export async function createTeacher(
  schoolId: mongoose.Types.ObjectId,
  overrides: { name?: string; teacherId?: string; subjects?: string[]; status?: IUser['status'] } = {}
): Promise<CreatePersonResult<ITeacher>> {
  const user = await User.create({
    schoolId,
    name: overrides.name ?? 'Test Teacher',
    phone: nextPhone(),
    role: 'TEACHER',
    status: overrides.status ?? 'ACTIVE',
  });
  const profile = await Teacher.create({
    userId: user._id,
    schoolId,
    teacherId: overrides.teacherId ?? `TCH-${new mongoose.Types.ObjectId().toString().slice(-6)}`,
    subjects: overrides.subjects ?? ['Mathematics'],
  });
  const session = asUser({ id: user._id.toString(), role: 'TEACHER', schoolId: schoolId.toString(), name: user.name });
  return { user, profile, session };
}

/** Creates a User + Admin profile pair belonging to the given school. */
export async function createAdmin(
  schoolId: mongoose.Types.ObjectId,
  overrides: { name?: string; role?: 'ADMIN' | 'PRINCIPAL' } = {}
): Promise<CreatePersonResult<IAdmin>> {
  const role = overrides.role ?? 'ADMIN';
  const user = await User.create({
    schoolId,
    name: overrides.name ?? 'Test Admin',
    phone: nextPhone(),
    role,
    status: 'ACTIVE',
  });
  const profile = await Admin.create({
    userId: user._id,
    schoolId,
    adminId: `ADM-${new mongoose.Types.ObjectId().toString().slice(-6)}`,
    permissions: [],
  });
  const session = asUser({ id: user._id.toString(), role, schoolId: schoolId.toString(), name: user.name });
  return { user, profile, session };
}

export function sessionFor(user: TestSessionUser): Session {
  return asUser(user);
}
