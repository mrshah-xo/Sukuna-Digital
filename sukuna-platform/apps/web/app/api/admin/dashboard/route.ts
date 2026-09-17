import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import {
  Student,
  Teacher,
  User,
  Attendance,
  Assignment,
  BusRoute,
  Notice,
  Payment,
  Memory,
  CalendarEvent,
  AuditLog
} from '@/models';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();
  const schoolId = new mongoose.Types.ObjectId(user.schoolId);

  // Today's boundaries
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // 1. Total Students
  const totalStudents = await Student.countDocuments({ schoolId });

  // 2. Total Teachers
  const totalTeachers = await Teacher.countDocuments({ schoolId });

  // 3. School Workers / Staff
  const totalStaff = await User.countDocuments({
    schoolId,
    role: { $in: ['STAFF', 'WORKER'] },
  });

  // 4. Attendance Today
  const totalAttendanceRecords = await Attendance.countDocuments({
    schoolId,
    date: { $gte: startOfToday, $lte: endOfToday },
  });

  const presentRecords = await Attendance.countDocuments({
    schoolId,
    date: { $gte: startOfToday, $lte: endOfToday },
    status: 'PRESENT',
  });

  const attendancePercentage = totalAttendanceRecords > 0 
    ? ((presentRecords / totalAttendanceRecords) * 100).toFixed(1)
    : 0;

  // 5. Active Routes
  const activeRoutes = await BusRoute.countDocuments({
    schoolId,
    status: 'ACTIVE'
  });

  // 6. Recent Notices (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentNotices = await Notice.countDocuments({
    schoolId,
    createdAt: { $gte: sevenDaysAgo }
  });

  // 7. Pending Assignments (due date >= today)
  const pendingAssignments = await Assignment.countDocuments({
    schoolId,
    dueDate: { $gte: startOfToday }
  });

  // 8. Active Memories
  const activeMemories = await Memory.countDocuments({
    schoolId,
    status: 'APPROVED'
  });

  // 9. Pending Payments
  const pendingPaymentsList = await Payment.find({
    schoolId,
    status: 'PENDING'
  }).select('amount').lean();

  const pendingPaymentsAmount = pendingPaymentsList.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingPaymentsCount = pendingPaymentsList.length;

  // Format pending payments: e.g. रु2.3M or रु85K or रु0
  let formattedPendingPayments = `रु${pendingPaymentsAmount.toLocaleString()}`;
  if (pendingPaymentsAmount >= 1000000) {
    formattedPendingPayments = `रु${(pendingPaymentsAmount / 1000000).toFixed(1)}M`;
  } else if (pendingPaymentsAmount >= 1000) {
    formattedPendingPayments = `रु${(pendingPaymentsAmount / 1000).toFixed(0)}K`;
  }

  // 10. Upcoming Events (Next 14 days)
  const upcomingEvents = await CalendarEvent.countDocuments({
    schoolId,
    date: { $gte: startOfToday }
  });

  // 11. Recent Activity from AuditLog
  const recentActivity = await AuditLog.find({ schoolId })
    .populate('userId', 'name role')
    .sort({ timestamp: -1 })
    .limit(8)
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        totalStudents,
        totalTeachers,
        totalStaff,
        attendanceToday: attendancePercentage,
        activeRoutes,
        recentNotices,
        pendingAssignments,
        activeMemories,
        pendingPayments: formattedPendingPayments,
        pendingPaymentsCount,
        upcomingEvents,
      },
      recentActivity,
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });
