import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';
import { StorageService } from '@/services/storage.service';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req, { user, params }) => {
  await connectDB();
  const { id } = params;

  if (!id || id === 'undefined') {
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

  // RBAC for sensitive files
  if (media.category === 'PAYMENT_PROOF') {
    if (media.uploadedBy.toString() !== user.id && !['ADMIN', 'PRINCIPAL'].includes(user.role)) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to view this payment proof' } }, { status: 403 });
    }
  }

  try {
    const buffer = await StorageService.getFileBuffer(
      media.category,
      media.schoolId.toString(),
      media.storageName
    );

    const headers = new Headers();
    headers.set('Content-Type', media.mimeType);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(buffer as any, {
      status: 200,
      headers
    });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'File missing from storage' } }, { status: 404 });
    }
    throw error;
  }
}, { requireSchoolId: true });
