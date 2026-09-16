import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { School, Media, AuditLog } from '@/models';
import { updateBrandingSchema, type UpdateBrandingInput } from '@/lib/admin-schemas';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();

  const school = await School.findById(user.schoolId)
    .select('schoolName branding versionHistory')
    .lean();
  
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
      schoolName: school.schoolName,
      branding: {
        ...school.branding,
        logo: logoUrl,
      },
      versionHistory: school.versionHistory || [],
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

export const PATCH = apiHandler<UpdateBrandingInput>(async (req, { user, validatedData }) => {
  await connectDB();

  // Helper to validate and secure media references against IDOR
  const validateMedia = async (mediaIdStr: string, allowedCategories: string[]) => {
    const media = await Media.findById(mediaIdStr);
    if (!media) {
      throw new Error('Selected media not found');
    }
    if (media.schoolId.toString() !== user.schoolId) {
      throw new Error('Cannot assign media from another school');
    }
    if (!allowedCategories.includes(media.category)) {
      throw new Error(`Selected media must be in category: ${allowedCategories.join(', ')}`);
    }
    return media;
  };

  try {
    if (validatedData.logoMediaId) {
      await validateMedia(validatedData.logoMediaId, ['BRANDING']);
    }
    if (validatedData.heroBannerMediaId) {
      await validateMedia(validatedData.heroBannerMediaId, ['BRANDING', 'LOGIN_SLIDER']);
    }
    if (validatedData.frame2MediaId) {
      await validateMedia(validatedData.frame2MediaId, ['BRANDING', 'LOGIN_SLIDER']);
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: err.message } }, { status: 400 });
  }

  // Prepare update object
  const updateData: Record<string, any> = {};
  
  if (validatedData.schoolName !== undefined) {
    updateData['schoolName'] = validatedData.schoolName;
  }
  if (validatedData.schoolDisplayName !== undefined) {
    updateData['branding.schoolDisplayName'] = validatedData.schoolDisplayName;
  }
  if (validatedData.shortName !== undefined) {
    updateData['branding.shortName'] = validatedData.shortName;
  }
  if (validatedData.appName !== undefined) {
    updateData['branding.appName'] = validatedData.appName;
  }
  if (validatedData.welcomeMessage !== undefined) {
    updateData['branding.welcomeMessage'] = validatedData.welcomeMessage;
  }
  if (validatedData.frame2Title !== undefined) {
    updateData['branding.frame2Title'] = validatedData.frame2Title;
  }
  if (validatedData.frame2Description !== undefined) {
    updateData['branding.frame2Description'] = validatedData.frame2Description;
  }
  if (validatedData.homePageHeroBanner !== undefined) {
    updateData['branding.homePageHeroBanner'] = validatedData.homePageHeroBanner;
  }
  if (validatedData.frame2Image !== undefined) {
    updateData['branding.frame2Image'] = validatedData.frame2Image;
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

  // Create version history entry
  const updatedSchool = await School.findByIdAndUpdate(
    user.schoolId,
    {
      $set: updateData,
      $push: {
        versionHistory: {
          version: `v${Date.now().toString().slice(-4)}`,
          date: new Date(),
          description: `Updated branding: ${Object.keys(validatedData).join(', ')}`,
          updatedBy: user.id,
        }
      }
    },
    { new: true, runValidators: true }
  ).select('schoolName branding versionHistory');

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

  const schoolObj = updatedSchool.toObject();

  return NextResponse.json({
    success: true,
    data: {
      schoolName: schoolObj.schoolName,
      branding: {
        ...schoolObj.branding,
        logo: logoUrl,
      },
      versionHistory: schoolObj.versionHistory || [],
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true, schema: updateBrandingSchema });
