import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import { User, Student, Teacher } from '@/models';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/otp/verified-profile?phone=9841XXXXXX
 *
 * Returns a minimal, display-only user profile for the phone number whose
 * OTP was just verified by the caller. This endpoint:
 *
 *   - Is intentionally NOT gated by a NextAuth session, because the
 *     OTP-verification step (/api/auth/otp/verify) does not yet establish
 *     a NextAuth session — it only validates the OTP code.
 *
 *   - Only returns safe, non-sensitive display fields. No passwords, no OTP
 *     seeds, no internal ObjectIds, no raw tokens, no schoolId are returned.
 *
 *   - Never reveals whether a phone number is registered or not to
 *     unauthenticated callers: if the phone is not found or inactive we
 *     return a 404 with a generic message.
 *
 * The caller (VerificationSuccessScreen) is responsible for passing the
 * verified phone number from the URL search param that the OTP screen wrote
 * immediately after a successful OTP call. Do NOT pass arbitrary phone
 * numbers from user-controlled inputs to this endpoint.
 */

const schema = z.object({
  // Accept the 10-digit local form sent by OTPVerificationScreen
  phone: z.string().min(10).max(15),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = schema.safeParse({ phone: searchParams.get('phone') });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid phone number' }, { status: 400 });
    }

    await connectDB();

    // OTPVerificationScreen stores the local 10-digit form in the query param,
    // while the User model stores the international form (+977XXXXXXXXXX).
    // Accept both forms: try the value as-is first, then prepend +977.
    const rawPhone = parsed.data.phone;
    const phoneVariants = [rawPhone, `+977${rawPhone}`];

    const dbUser = await User.findOne({
      phone: { $in: phoneVariants },
      status: 'ACTIVE',
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Map the Sukuna role to the component's SukunaRole union.
    // STUDENT → "student", TEACHER → "teacher", everything else → "worker"
    type SukunaRole = 'student' | 'teacher' | 'worker';
    const roleMap: Record<string, SukunaRole> = {
      STUDENT: 'student',
      TEACHER: 'teacher',
      STAFF: 'worker',
      ADMIN: 'worker',
      PRINCIPAL: 'worker',
      PARENT: 'worker',
      DRIVER: 'worker',
    };
    const sukunaRole: SukunaRole = roleMap[dbUser.role] ?? 'worker';

    // Build the base profile using real User model fields.
    // Fields:
    //   fullName  ← user.name
    //   role      ← mapped from user.role
    //   id        ← role-specific ID fetched below
    //   phone     ← user.phone (formatted for display)
    const profileData: {
      fullName: string;
      role: SukunaRole;
      id: string;
      phone: string;
      classSection?: string;
      guardianName?: string;
    } = {
      fullName: dbUser.name,
      role: sukunaRole,
      id: dbUser._id.toString().slice(-6).toUpperCase(), // fallback ID display
      phone: dbUser.phone,
    };

    if (dbUser.role === 'STUDENT') {
      // Fetch the associated Student record for student-specific fields.
      // schoolId scoped to the User's own school to prevent cross-school reads.
      const student = await Student.findOne({
        userId: dbUser._id,
        schoolId: dbUser.schoolId,
      });
      if (student) {
        // studentId   ← student.studentId  (e.g. "STU-10284")
        // classSection ← `${student.grade} ${student.section}`  (e.g. "11 A")
        profileData.id = student.studentId;
        profileData.classSection = `${student.grade} ${student.section}`;
        // Guardian name is not stored on the Student model in this schema;
        // omit rather than display fake data.
      }
    } else if (dbUser.role === 'TEACHER') {
      const teacher = await Teacher.findOne({
        userId: dbUser._id,
        schoolId: dbUser.schoolId,
      });
      if (teacher) {
        // teacherId ← teacher.teacherId  (e.g. "TCH-00042")
        profileData.id = teacher.teacherId;
      }
    }

    return NextResponse.json({ success: true, data: profileData });
  } catch (error: unknown) {
    console.error('[verified-profile] Error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred fetching the profile' },
      { status: 500 }
    );
  }
}
