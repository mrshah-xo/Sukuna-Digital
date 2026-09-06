import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { School, Media, AuditLog } from '@/models';
import { updateBrandingSchema, type UpdateBrandingInput } from '@/lib/admin-schemas';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();

  const school = await School.findById(user.schoolId).select('branding').lean();
  
  if (!school) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'School not found' } }, { status: 404 });
  }

  // Populate logo details if logoMediaId exists
  let logoUrl = school.branding?.logo;
  if (school.branding?.logoMediaId) {
    const media = await Media.findById(school.branding.logoMediaId).lean();
    if (media) {
      logoUrl = media.url;
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      branding: {
        ...school.branding,
        logo: logoUrl // Resolved URL for the client
      }
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

export const PATCH = apiHandler<UpdateBrandingInput>(async (req, { user, validatedData }) => {
  await connectDB();

  // Protect against IDOR on logoMediaId
  if (validatedData.logoMediaId) {
    const media = await Media.findById(validatedData.logoMediaId);
    if (!media) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Selected media not found' } }, { status: 404 });
    }
    if (media.schoolId.toString() !== user.schoolId) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Cannot assign media from another school' } }, { status: 403 });
    }
    if (media.category !== 'BRANDING') {
      return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Selected media must be in the BRANDING category' } }, { status: 400 });
    }
  }

  // Prepare update object for nested branding
  const updateData: Record<string, any> = {};
  
  if (validatedData.schoolDisplayName !== undefined) {
    updateData['branding.schoolDisplayName'] = validatedData.schoolDisplayName;
  }
  if (validatedData.shortName !== undefined) {
    updateData['branding.shortName'] = validatedData.shortName;
  }
  if (validatedData.primaryColor !== undefined) {
    updateData['branding.primaryColor'] = validatedData.primaryColor;
  }
  if (validatedData.secondaryColor !== undefined) {
    updateData['branding.secondaryColor'] = validatedData.secondaryColor;
  }
  if (validatedData.logoMediaId !== undefined) {
    updateData['branding.logoMediaId'] = validatedData.logoMediaId;
    if (validatedData.logoMediaId === null) {
      updateData['branding.logo'] = null;
    }
  }

  // If there are no updates, return early
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ success: true, message: 'No changes made' });
  }

  const updatedSchool = await School.findByIdAndUpdate(
    user.schoolId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('branding');

  if (!updatedSchool) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'School not found' } }, { status: 404 });
  }

  // Resolve logo URL for response
  let logoUrl = updatedSchool.branding?.logo;
  if (updatedSchool.branding?.logoMediaId) {
    const media = await Media.findById(updatedSchool.branding.logoMediaId).lean();
    if (media) {
      logoUrl = media.url;
    }
  }

  // Audit Logging
  await AuditLog.create({
    schoolId: user.schoolId,
    userId: user.id,
    action: 'UPDATE_BRANDING',
    resource: 'School',
    targetId: updatedSchool._id,
    metadata: { fieldsUpdated: Object.keys(validatedData) }
  });

  return NextResponse.json({
    success: true,
    data: {
      branding: {
        ...updatedSchool.branding?.toObject(),
        logo: logoUrl
      }
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true, schema: updateBrandingSchema });
