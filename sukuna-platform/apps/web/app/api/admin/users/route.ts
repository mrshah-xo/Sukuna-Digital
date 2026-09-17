import { NextResponse } from 'next/server';
import mongoose, { FilterQuery } from 'mongoose';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { User, type IUser } from '@/models';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const role = searchParams.get('role') || '';
  const status = searchParams.get('status') || '';

  const query: FilterQuery<IUser> = {
    schoolId: new mongoose.Types.ObjectId(user.schoolId),
  };

  if (role && role !== 'All') {
    query.role = role.toUpperCase();
  }

  if (status && status !== 'All') {
    if (status === 'Online' || status === 'Active') query.status = 'ACTIVE';
    else if (status === 'Blocked' || status === 'Suspended') query.status = 'SUSPENDED';
    else if (status === 'Offline' || status === 'Inactive') query.status = 'INACTIVE';
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .sort({ lastLogin: -1, createdAt: -1 })
    .limit(100)
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      users: users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        phone: u.phone,
        role: u.role.charAt(0) + u.role.slice(1).toLowerCase(),
        class: u.role === 'STUDENT' ? 'Student' : u.role === 'TEACHER' ? 'Faculty' : 'Staff',
        status: u.status === 'ACTIVE' ? 'Online' : u.status === 'SUSPENDED' ? 'Blocked' : 'Offline',
        lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never',
        device: 'Web / Mobile',
        verified: true,
        avatar: u.avatar || u.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
      })),
      total: users.length,
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

export const PATCH = apiHandler(async (req, { user }) => {
  await connectDB();
  const body = await req.json();
  const { userId, action } = body;

  if (!userId || !action) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'userId and action are required' } },
      { status: 400 }
    );
  }

  const targetUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
    schoolId: new mongoose.Types.ObjectId(user.schoolId),
  });

  if (!targetUser) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'User not found in this school' } },
      { status: 404 }
    );
  }

  if (action === 'SUSPEND') {
    targetUser.status = 'SUSPENDED';
  } else if (action === 'ACTIVATE') {
    targetUser.status = 'ACTIVE';
  } else if (action === 'DEACTIVATE') {
    targetUser.status = 'INACTIVE';
  } else {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid action' } },
      { status: 400 }
    );
  }

  await targetUser.save();

  await AuditLog.create({
    schoolId: user.schoolId,
    userId: user.id,
    action: `${action}_USER`,
    resource: 'User',
    targetId: targetUser._id,
    metadata: { targetUserPhone: targetUser.phone, targetUserName: targetUser.name }
  });

  return NextResponse.json({
    success: true,
    message: `User status updated to ${targetUser.status}`,
    data: {
      id: targetUser._id.toString(),
      status: targetUser.status === 'ACTIVE' ? 'Online' : targetUser.status === 'SUSPENDED' ? 'Blocked' : 'Offline',
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

