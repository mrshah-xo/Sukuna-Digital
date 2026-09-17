import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { PaymentConfig, AuditLog, Media } from '@/models';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();
  const config = await PaymentConfig.findOne({
    schoolId: new mongoose.Types.ObjectId(user.schoolId),
  }).lean();

  return NextResponse.json({
    success: true,
    data: config ? {
      provider: config.provider,
      merchantName: config.merchantName,
      accountNumber: config.accountNumber || '',
      qrImageUrl: config.qrImageUrl || '',
      isActive: config.isActive,
    } : {
      provider: 'BANK_TRANSFER',
      merchantName: 'Sukuna Secondary School',
      accountNumber: '',
      qrImageUrl: '',
      isActive: true,
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

const patchQrSchema = z.object({
  merchantName: z.string().min(2, 'Merchant name is required'),
  accountNumber: z.string().optional(),
  qrImageUrl: z.string().optional(),
  qrMediaId: z.string().optional(),
  provider: z.enum(['BANK_TRANSFER', 'ESEWA', 'KHALTI', 'OTHER']).default('BANK_TRANSFER'),
  isActive: z.boolean().default(true),
}).strict();

export const PATCH = apiHandler(async (req, { user }) => {
  await connectDB();
  const body = await req.json();
  const parsed = patchQrSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: parsed.error.issues[0]?.message || 'Validation failed' } },
      { status: 400 }
    );
  }

  let resolvedQrUrl = parsed.data.qrImageUrl;

  // Validate and resolve QR media if mediaId is provided
  if (parsed.data.qrMediaId) {
    const media = await Media.findById(parsed.data.qrMediaId);
    if (!media || media.schoolId.toString() !== user.schoolId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid or unauthorized media ID' } },
        { status: 400 }
      );
    }
    resolvedQrUrl = media.url;
  }

  const updatedConfig = await PaymentConfig.findOneAndUpdate(
    { schoolId: new mongoose.Types.ObjectId(user.schoolId) },
    {
      $set: {
        schoolId: new mongoose.Types.ObjectId(user.schoolId),
        merchantName: parsed.data.merchantName,
        accountNumber: parsed.data.accountNumber || '',
        qrImageUrl: resolvedQrUrl || '',
        provider: parsed.data.provider,
        isActive: parsed.data.isActive,
      }
    },
    { upsert: true, new: true }
  );

  await AuditLog.create({
    schoolId: user.schoolId,
    userId: user.id,
    action: 'UPDATE_PAYMENT_CONFIG',
    resource: 'PaymentConfig',
    targetId: updatedConfig._id,
    metadata: { provider: updatedConfig.provider, merchantName: updatedConfig.merchantName }
  });

  return NextResponse.json({
    success: true,
    message: 'Payment QR configuration updated successfully',
    data: {
      provider: updatedConfig.provider,
      merchantName: updatedConfig.merchantName,
      accountNumber: updatedConfig.accountNumber,
      qrImageUrl: updatedConfig.qrImageUrl,
      isActive: updatedConfig.isActive,
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });
