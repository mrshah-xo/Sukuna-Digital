import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { Notice, AuditLog } from '@/models';

export const dynamic = 'force-dynamic';

const createNoticeSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  body: z.string().min(5, 'Notice content is required'),
  target: z.string().default('All Users'),
}).strict();

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();

  const notices = await Notice.find({
    schoolId: new mongoose.Types.ObjectId(user.schoolId),
    type: 'NOTICE',
  })
    .populate('authorId', 'name role')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      notices: notices.map((n: any) => ({
        id: n._id.toString(),
        title: n.title,
        body: n.content,
        target: n.targetAudience?.length ? n.targetAudience.map((t: any) => t.grade).join(', ') : 'All Users',
        author: n.authorId?.name || 'Admin',
        date: new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        reads: 0,
        pinned: false,
        status: 'Published',
      })),
    },
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

export const POST = apiHandler(async (req, { user }) => {
  await connectDB();
  const body = await req.json();
  const parsed = createNoticeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({
      success: false,
      error: { code: 'BAD_REQUEST', message: parsed.error.issues[0]?.message || 'Validation failed' },
    }, { status: 400 });
  }

  const newNotice = await Notice.create({
    schoolId: user.schoolId,
    authorId: user.id,
    type: 'NOTICE',
    title: parsed.data.title,
    content: parsed.data.body,
    targetAudience: [{ grade: parsed.data.target }],
  });

  await AuditLog.create({
    schoolId: user.schoolId,
    userId: user.id,
    action: 'CREATE_NOTICE',
    resource: 'Notice',
    targetId: newNotice._id,
    metadata: { title: parsed.data.title },
  });

  return NextResponse.json({
    success: true,
    data: {
      id: newNotice._id.toString(),
      title: newNotice.title,
      body: newNotice.content,
      target: parsed.data.target,
      author: 'Admin',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      reads: 0,
      pinned: false,
      status: 'Published',
    },
  }, { status: 201 });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });
