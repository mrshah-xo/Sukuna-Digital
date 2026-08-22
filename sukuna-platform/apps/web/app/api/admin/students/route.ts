import { NextResponse } from 'next/server';
import mongoose, { FilterQuery } from 'mongoose';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { User, Student, type IUser, type IStudent } from '@/models';
import { createStudentSchema, type CreateStudentInput } from '@/lib/admin-schemas';

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const grade = searchParams.get('grade') || '';

  const skip = (page - 1) * limit;

  // Build match query for students
  const matchQuery: FilterQuery<IStudent> = { schoolId: new mongoose.Types.ObjectId(user.schoolId) };
  if (grade) {
    matchQuery.grade = grade;
  }
  
  // To search by name, we need to populate or lookup from the User collection
  // Mongoose aggregate is better for searching populated fields, but let's keep it simple:
  // First find users matching the search name
  const userQuery: FilterQuery<IUser> = { role: 'STUDENT', schoolId: new mongoose.Types.ObjectId(user.schoolId) };
  if (search) {
    userQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const matchingUsers = await User.find(userQuery).select('_id name phone status avatar');
  const userIds = matchingUsers.map((u) => u._id);

  if (search || matchingUsers.length > 0) {
    matchQuery.userId = { $in: userIds };
  }

  // Get total count
  const total = await Student.countDocuments(matchQuery);

  // Get paginated students
  const students = await Student.find(matchQuery)
    .populate({
      path: 'userId',
      select: 'name phone status avatar'
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

export const POST = apiHandler<CreateStudentInput>(async (req, { user, validatedData }) => {
  await connectDB();

  // Check if user (phone) already exists
  const existingUser = await User.findOne({ phone: validatedData.phone });
  if (existingUser) {
    return NextResponse.json({ success: false, error: { code: 'CONFLICT', message: 'User with this phone already exists' } }, { status: 409 });
  }

  // Check if studentId already exists in this school
  const existingStudentId = await Student.findOne({ studentId: validatedData.studentId, schoolId: user.schoolId });
  if (existingStudentId) {
    return NextResponse.json({ success: false, error: { code: 'CONFLICT', message: 'Student ID already exists' } }, { status: 409 });
  }

  // Transactions require Replica Sets. Since we don't know if the local env supports it, 
  // we do a simple sequential creation with rollback.
  let newUser;
  try {
    newUser = await User.create({
      schoolId: user.schoolId,
      name: validatedData.name,
      phone: validatedData.phone,
      role: 'STUDENT',
      status: 'ACTIVE',
    });

    const newStudent = await Student.create({
      userId: newUser._id,
      schoolId: user.schoolId,
      studentId: validatedData.studentId,
      grade: validatedData.grade,
      section: validatedData.section,
    });

    return NextResponse.json({
      success: true,
      data: newStudent,
    }, { status: 201 });
  } catch (error) {
    // Basic rollback
    if (newUser) {
      await User.findByIdAndDelete(newUser._id);
    }
    throw error;
  }
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true, schema: createStudentSchema });
