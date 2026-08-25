import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { User, Student, Teacher } from '@/models';
import connectDB from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(
  async (_req, { user }) => {
    await connectDB();

    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // SECURITY: Only expose safe, non-sensitive fields. Never expose
    // password hashes, OTP seeds, raw tokens, or internal ObjectIds.
    const profileData: Record<string, unknown> = {
      name: dbUser.name,
      phone: dbUser.phone,
      role: dbUser.role,
      profilePicture: dbUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      email: '',
      address: '',
      dateOfBirth: '',
      bloodGroup: '',
      attendance: 0,
      gpa: 0,
      starPoints: 0,
      showAcademicInfo: false,
    };

    if (dbUser.role === 'STUDENT') {
      // schoolId scoping: Student is already owned by this user's schoolId
      // via the school isolation in the User query above.
      const student = await Student.findOne({ userId: dbUser._id, schoolId: dbUser.schoolId });
      if (student) {
        profileData.studentId = student.studentId;
        profileData.class = `${student.grade}-${student.section}`;
        profileData.rollNo = '';
        profileData.showAcademicInfo = true;
      }
    } else if (dbUser.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ userId: dbUser._id, schoolId: dbUser.schoolId });
      if (teacher) {
        profileData.teacherId = teacher.teacherId;
        profileData.subjects = teacher.subjects;
      }
    }

    return NextResponse.json({ success: true, data: profileData });
  },
  // Require any authenticated user — no role restriction.
  // schoolId isolation is enforced internally via User.findById(user.id).
  { roles: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN', 'PRINCIPAL', 'PARENT', 'DRIVER'] }
);
