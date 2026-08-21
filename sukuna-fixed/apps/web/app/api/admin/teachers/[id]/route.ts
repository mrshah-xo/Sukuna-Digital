import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { apiHandler, ApiError } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { User, Teacher, type IUser } from '@/models';
import { updateTeacherSchema, type UpdateTeacherInput } from '@/lib/admin-schemas';

export const GET = apiHandler(async (req, { user, params }) => {
  await connectDB();
  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid teacher ID', 'BAD_REQUEST');
  }

  const teacher = await Teacher.findOne({ 
    _id: id, 
    schoolId: user.schoolId 
  }).populate('userId', 'name phone status avatar').lean();

  if (!teacher) {
    throw new ApiError(404, 'Teacher not found', 'NOT_FOUND');
  }

  return NextResponse.json({ success: true, data: teacher });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });


export const PATCH = apiHandler<UpdateTeacherInput>(async (req, { user, params, validatedData }) => {
  await connectDB();
  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid teacher ID', 'BAD_REQUEST');
  }

  const teacher = await Teacher.findOne({ _id: id, schoolId: user.schoolId });
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found', 'NOT_FOUND');
  }

  if (validatedData.teacherId && validatedData.teacherId !== teacher.teacherId) {
    const existingId = await Teacher.findOne({ teacherId: validatedData.teacherId, schoolId: user.schoolId });
    if (existingId) {
      throw new ApiError(409, 'Teacher ID already exists', 'CONFLICT');
    }
    teacher.teacherId = validatedData.teacherId;
  }

  if (validatedData.subjects) teacher.subjects = validatedData.subjects;
  if (validatedData.assignedClasses) teacher.assignedClasses = validatedData.assignedClasses;
  
  await teacher.save();

  const updateUserData: Partial<Pick<IUser, 'name' | 'phone' | 'status'>> = {};
  if (validatedData.name) updateUserData.name = validatedData.name;
  if (validatedData.phone) updateUserData.phone = validatedData.phone;
  if (validatedData.status) updateUserData.status = validatedData.status;

  if (Object.keys(updateUserData).length > 0) {
    if (validatedData.phone) {
      const existingPhone = await User.findOne({ phone: validatedData.phone, _id: { $ne: teacher.userId } });
      if (existingPhone) {
        throw new ApiError(409, 'Phone number already registered', 'CONFLICT');
      }
    }
    await User.findByIdAndUpdate(teacher.userId, updateUserData);
  }

  const updatedTeacher = await Teacher.findById(id).populate('userId', 'name phone status avatar').lean();

  return NextResponse.json({ success: true, data: updatedTeacher });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true, schema: updateTeacherSchema });


export const DELETE = apiHandler(async (req, { user, params }) => {
  await connectDB();
  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid teacher ID', 'BAD_REQUEST');
  }

  const teacher = await Teacher.findOne({ _id: id, schoolId: user.schoolId });
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found', 'NOT_FOUND');
  }

  if (teacher.userId.toString() === user.id) {
    throw new ApiError(403, 'You cannot archive your own account', 'FORBIDDEN');
  }

  await User.findByIdAndUpdate(teacher.userId, { status: 'INACTIVE' });

  return NextResponse.json({ 
    success: true, 
    message: 'Teacher archived successfully',
    data: { _id: id }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });
