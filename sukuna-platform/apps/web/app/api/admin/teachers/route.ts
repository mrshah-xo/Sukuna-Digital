import { NextResponse } from 'next/server';
import mongoose, { FilterQuery } from 'mongoose';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { User, Teacher, type IUser, type ITeacher } from '@/models';
import { createTeacherSchema, type CreateTeacherInput } from '@/lib/admin-schemas';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  const skip = (page - 1) * limit;

  const matchQuery: FilterQuery<ITeacher> = { schoolId: new mongoose.Types.ObjectId(user.schoolId) };
  
  const userQuery: FilterQuery<IUser> = { role: 'TEACHER', schoolId: new mongoose.Types.ObjectId(user.schoolId) };
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

  const total = await Teacher.countDocuments(matchQuery);

  const teachers = await Teacher.find(matchQuery)
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
      teachers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

export const POST = apiHandler<CreateTeacherInput>(async (req, { user, validatedData }) => {
  await connectDB();

  const existingUser = await User.findOne({ phone: validatedData.phone });
  if (existingUser) {
    return NextResponse.json({ success: false, error: { code: 'CONFLICT', message: 'User with this phone already exists' } }, { status: 409 });
  }

  const existingTeacherId = await Teacher.findOne({ teacherId: validatedData.teacherId, schoolId: user.schoolId });
  if (existingTeacherId) {
    return NextResponse.json({ success: false, error: { code: 'CONFLICT', message: 'Teacher ID already exists' } }, { status: 409 });
  }

  let newUser;
  try {
    newUser = await User.create({
      schoolId: user.schoolId,
      name: validatedData.name,
      phone: validatedData.phone,
      role: 'TEACHER',
      status: 'ACTIVE',
    });

    const newTeacher = await Teacher.create({
      userId: newUser._id,
      schoolId: user.schoolId,
      teacherId: validatedData.teacherId,
      subjects: validatedData.subjects || [],
      assignedClasses: validatedData.assignedClasses || [],
    });

    return NextResponse.json({
      success: true,
      data: newTeacher,
    }, { status: 201 });
  } catch (error) {
    if (newUser) {
      await User.findByIdAndDelete(newUser._id);
    }
    throw error;
  }
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true, schema: createTeacherSchema });
