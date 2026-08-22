import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { apiHandler, ApiError } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { User, Student, type IUser } from '@/models';
import { updateStudentSchema, type UpdateStudentInput } from '@/lib/admin-schemas';

export const GET = apiHandler(async (req, { user, params }) => {
  await connectDB();
  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid student ID', 'BAD_REQUEST');
  }

  const student = await Student.findOne({ 
    _id: id, 
    schoolId: user.schoolId 
  }).populate('userId', 'name phone status avatar').lean();

  if (!student) {
    throw new ApiError(404, 'Student not found', 'NOT_FOUND');
  }

  return NextResponse.json({ success: true, data: student });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });


export const PATCH = apiHandler<UpdateStudentInput>(async (req, { user, params, validatedData }) => {
  await connectDB();
  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid student ID', 'BAD_REQUEST');
  }

  const student = await Student.findOne({ _id: id, schoolId: user.schoolId });
  if (!student) {
    throw new ApiError(404, 'Student not found', 'NOT_FOUND');
  }

  // If studentId changes, check uniqueness
  if (validatedData.studentId && validatedData.studentId !== student.studentId) {
    const existingId = await Student.findOne({ studentId: validatedData.studentId, schoolId: user.schoolId });
    if (existingId) {
      throw new ApiError(409, 'Student ID already exists', 'CONFLICT');
    }
    student.studentId = validatedData.studentId;
  }

  if (validatedData.grade) student.grade = validatedData.grade;
  if (validatedData.section) student.section = validatedData.section;
  
  await student.save();

  // Update associated user if necessary
  const updateUserData: Partial<Pick<IUser, 'name' | 'phone' | 'status'>> = {};
  if (validatedData.name) updateUserData.name = validatedData.name;
  if (validatedData.phone) updateUserData.phone = validatedData.phone;
  if (validatedData.status) updateUserData.status = validatedData.status;

  if (Object.keys(updateUserData).length > 0) {
    // If phone changes, check uniqueness
    if (validatedData.phone) {
      const existingPhone = await User.findOne({ phone: validatedData.phone, _id: { $ne: student.userId } });
      if (existingPhone) {
        throw new ApiError(409, 'Phone number already registered', 'CONFLICT');
      }
    }
    await User.findByIdAndUpdate(student.userId, updateUserData);
  }

  const updatedStudent = await Student.findById(id).populate('userId', 'name phone status avatar').lean();

  return NextResponse.json({ success: true, data: updatedStudent });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true, schema: updateStudentSchema });


export const DELETE = apiHandler(async (req, { user, params }) => {
  await connectDB();
  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid student ID', 'BAD_REQUEST');
  }

  const student = await Student.findOne({ _id: id, schoolId: user.schoolId });
  if (!student) {
    throw new ApiError(404, 'Student not found', 'NOT_FOUND');
  }

  if (student.userId.toString() === user.id) {
    throw new ApiError(403, 'You cannot archive your own account', 'FORBIDDEN');
  }

  // We archive by setting user status to INACTIVE instead of hard deleting
  await User.findByIdAndUpdate(student.userId, { status: 'INACTIVE' });

  return NextResponse.json({ 
    success: true, 
    message: 'Student archived successfully',
    data: { _id: id }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });
