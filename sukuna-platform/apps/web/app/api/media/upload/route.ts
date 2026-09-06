import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { Media, AuditLog } from '@/models';
import { StorageService } from '@/services/storage.service';
import mongoose from 'mongoose';
import { type Role } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_MB: Record<string, number> = {
  BRANDING: 2,
  LOGIN_SLIDER: 5,
  PAYMENT_QR: 2,
  PAYMENT_PROOF: 5,
  NOTICE: 10,
  RESOURCE: 20,
  OTHER: 2,
};

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export const POST = apiHandler(async (req, { user }) => {
  await connectDB();
  
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const category = formData.get('category') as string | null;
  
  if (!file || !category) {
    return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'File and category are required' } }, { status: 400 });
  }

  const validCategories = ['BRANDING', 'LOGIN_SLIDER', 'PAYMENT_QR', 'PAYMENT_PROOF', 'NOTICE', 'RESOURCE', 'OTHER'];
  if (!validCategories.includes(category)) {
    return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid category' } }, { status: 400 });
  }

  const categoryRoles: Record<string, Role[]> = {
    BRANDING: ['ADMIN', 'PRINCIPAL'],
    LOGIN_SLIDER: ['ADMIN', 'PRINCIPAL'],
    PAYMENT_QR: ['ADMIN', 'PRINCIPAL'],
    PAYMENT_PROOF: ['STUDENT', 'PARENT', 'ADMIN', 'PRINCIPAL'],
    NOTICE: ['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF'],
    RESOURCE: ['ADMIN', 'PRINCIPAL', 'TEACHER'],
    OTHER: ['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'STUDENT'],
  };

  const allowedRoles = categoryRoles[category] || [];
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to upload this category of media' } }, { status: 403 });
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid file type. Allowed: JPEG, PNG, WEBP, PDF' } }, { status: 400 });
  }

  const maxSize = (MAX_FILE_SIZE_MB[category] || 2) * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: `File size exceeds limit of ${MAX_FILE_SIZE_MB[category] || 2}MB` } }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { storageName, provider } = await StorageService.uploadFile(
    buffer, 
    category, 
    user.schoolId, 
    file.name
  );

  const mediaId = new mongoose.Types.ObjectId();
  const url = `/api/media/${mediaId}/serve`;

  const newMedia = await Media.create({
    _id: mediaId,
    schoolId: user.schoolId,
    uploadedBy: user.id,
    originalName: file.name,
    storageName,
    url,
    storageProvider: provider,
    mimeType: file.type,
    size: file.size,
    category
  });

  if (['BRANDING', 'LOGIN_SLIDER', 'PAYMENT_QR'].includes(category)) {
    await AuditLog.create({
      schoolId: user.schoolId,
      userId: user.id,
      action: 'UPLOAD_MEDIA',
      resource: 'Media',
      targetId: newMedia._id,
      metadata: { category, originalName: file.name }
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: newMedia._id,
      url: newMedia.url,
      mimeType: newMedia.mimeType,
      size: newMedia.size,
      category: newMedia.category
    }
  }, { status: 201 });
}, { requireSchoolId: true });
