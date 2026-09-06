import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { Media, AuditLog } from '@/models';
import { StorageService } from '@/services/storage.service';

export const dynamic = 'force-dynamic';

export const DELETE = apiHandler(async (req, { user, params }) => {
  await connectDB();
  const { id } = params;

  if (!id) {
    return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Media ID is required' } }, { status: 400 });
  }

  const media = await Media.findById(id);

  if (!media) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Media not found' } }, { status: 404 });
  }

  // School isolation
  if (media.schoolId.toString() !== user.schoolId) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });
  }

  // RBAC for deletion
  // ADMIN and PRINCIPAL can delete anything
  // Other roles can only delete their own uploads if it is permitted
  const isOwner = media.uploadedBy.toString() === user.id;
  const isAdmin = ['ADMIN', 'PRINCIPAL'].includes(user.role);

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this media' } }, { status: 403 });
  }

  // Some categories cannot be deleted by non-admins even if they uploaded it
  if (!isAdmin && ['BRANDING', 'LOGIN_SLIDER', 'PAYMENT_QR'].includes(media.category)) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Only administrators can delete this category of media' } }, { status: 403 });
  }

  // Delete from storage
  await StorageService.deleteFile(media.category, media.schoolId.toString(), media.storageName);

  // Delete from DB
  await Media.findByIdAndDelete(id);

  // Audit Log
  await AuditLog.create({
    schoolId: user.schoolId,
    userId: user.id,
    action: 'DELETE_MEDIA',
    resource: 'Media',
    targetId: media._id,
    metadata: { category: media.category, originalName: media.originalName }
  });

  return NextResponse.json({
    success: true,
    data: { id: media._id }
  });
}, { requireSchoolId: true });
