import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { Payment, AuditLog } from '@/models';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search') || '';

  const query: any = {
    schoolId: new mongoose.Types.ObjectId(user.schoolId),
  };

  if (status && status !== 'All') {
    query.status = status.toUpperCase();
  }

  const payments = await Payment.find(query)
    .populate('studentId', 'name phone studentId class')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const formatted = payments
    .map((p: any) => {
      const studentName = p.studentId?.name || 'Student';
      const studentClass = p.studentId?.class || 'Grade 10';
      const feeLabel =
        p.feeType === 'SCHOOL_FEE' ? 'School Fees' :
        p.feeType === 'BUS_FEE' ? 'Bus Fees' :
        p.feeType === 'EXAM_FEE' ? 'Exam Fees' : 'Other Charges';
      const methodLabel =
        p.method === 'BANK_TRANSFER' ? 'Bank Transfer' :
        p.method === 'ONLINE' ? 'QR / Online' : 'Cash';
      const statusLabel =
        p.status === 'PAID' ? 'Paid' :
        p.status === 'PENDING' ? 'Pending' :
        p.status === 'REJECTED' ? 'Rejected' : 'Overdue';

      return {
        id: p._id.toString(),
        student: studentName,
        class: studentClass,
        type: feeLabel,
        amount: p.amount,
        date: new Date(p.date || p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        method: methodLabel,
        status: statusLabel,
        receipt: p.receiptNumber || '—',
        proofImageUrl: p.proofImageUrl || null,
        rejectionReason: p.rejectionReason || null,
      };
    })
    .filter((p: any) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return p.student.toLowerCase().includes(s) || p.type.toLowerCase().includes(s) || (p.receipt && p.receipt.toLowerCase().includes(s));
    });

  return NextResponse.json({
    success: true,
    data: { payments: formatted }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

const patchPaymentSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  action: z.enum(['VERIFY', 'REJECT']),
  rejectionReason: z.string().optional(),
}).strict();

export const PATCH = apiHandler(async (req, { user }) => {
  await connectDB();
  const body = await req.json();
  const parsed = patchPaymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: parsed.error.issues[0]?.message || 'Validation failed' } },
      { status: 400 }
    );
  }

  const { paymentId, action, rejectionReason } = parsed.data;

  const payment = await Payment.findOne({
    _id: paymentId,
    schoolId: new mongoose.Types.ObjectId(user.schoolId),
  });

  if (!payment) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Payment record not found' } },
      { status: 404 }
    );
  }

  if (action === 'VERIFY') {
    // Generate unique sequential or random receipt number
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(1000 + Math.random() * 9000);
    const receiptNum = payment.receiptNumber || `RCP-${timestamp}${random}`;

    payment.status = 'PAID';
    payment.receiptNumber = receiptNum;
    payment.verifiedBy = new mongoose.Types.ObjectId(user.id);
    payment.rejectionReason = undefined;
    await payment.save();

    await AuditLog.create({
      schoolId: user.schoolId,
      userId: user.id,
      action: 'VERIFY_PAYMENT',
      resource: 'Payment',
      targetId: payment._id,
      metadata: { receiptNumber: receiptNum, amount: payment.amount }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully and official receipt generated.',
      data: {
        id: payment._id.toString(),
        status: 'Paid',
        receipt: receiptNum,
      }
    });
  } else if (action === 'REJECT') {
    if (!rejectionReason || !rejectionReason.trim()) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Rejection reason is required when rejecting a payment' } },
        { status: 400 }
      );
    }

    payment.status = 'REJECTED';
    payment.rejectionReason = rejectionReason.trim();
    payment.verifiedBy = new mongoose.Types.ObjectId(user.id);
    await payment.save();

    await AuditLog.create({
      schoolId: user.schoolId,
      userId: user.id,
      action: 'REJECT_PAYMENT',
      resource: 'Payment',
      targetId: payment._id,
      metadata: { reason: rejectionReason.trim(), amount: payment.amount }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment rejected with documented reason.',
      data: {
        id: payment._id.toString(),
        status: 'Rejected',
        rejectionReason: rejectionReason.trim(),
      }
    });
  }
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });
