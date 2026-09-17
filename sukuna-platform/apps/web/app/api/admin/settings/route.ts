import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { School, AuditLog } from '@/models';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();
  const school = await School.findById(user.schoolId).select('settings').lean();

  return NextResponse.json({
    success: true,
    data: {
      featuresEnabled: school?.settings?.featuresEnabled || [
        'Sukuna Book',
        'Memories',
        'Research Hub',
        'Library Access',
        'Online Payments',
        'Push Notifications',
        'OTP Verification',
      ],
      notificationConfig: school?.settings?.notificationConfig || {
        smsOtp: true,
        pushNotices: true,
        pushResults: true,
        paymentReminders: true,
        researchAlerts: true,
        newDeviceAlert: false,
      },
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

const patchSettingsSchema = z.object({
  featuresEnabled: z.array(z.string()).optional(),
  notificationConfig: z.object({
    smsOtp: z.boolean().optional(),
    pushNotices: z.boolean().optional(),
    pushResults: z.boolean().optional(),
    paymentReminders: z.boolean().optional(),
    researchAlerts: z.boolean().optional(),
    newDeviceAlert: z.boolean().optional(),
  }).optional(),
}).strict();

export const PATCH = apiHandler(async (req, { user }) => {
  await connectDB();
  const body = await req.json();
  const parsed = patchSettingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: parsed.error.issues[0]?.message || 'Validation failed' } },
      { status: 400 }
    );
  }

  const updateFields: Record<string, any> = {};
  if (parsed.data.featuresEnabled !== undefined) {
    updateFields['settings.featuresEnabled'] = parsed.data.featuresEnabled;
  }
  if (parsed.data.notificationConfig !== undefined) {
    for (const [k, v] of Object.entries(parsed.data.notificationConfig)) {
      updateFields[`settings.notificationConfig.${k}`] = v;
    }
  }

  const updatedSchool = await School.findByIdAndUpdate(
    user.schoolId,
    { $set: updateFields },
    { new: true }
  ).select('settings');

  await AuditLog.create({
    schoolId: user.schoolId,
    userId: user.id,
    action: 'UPDATE_SETTINGS',
    resource: 'SchoolSettings',
    targetId: user.schoolId,
    metadata: { updatedFields: Object.keys(updateFields) }
  });

  return NextResponse.json({
    success: true,
    message: 'Settings updated successfully',
    data: updatedSchool?.settings,
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });
