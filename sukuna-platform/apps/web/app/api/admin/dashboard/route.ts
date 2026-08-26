import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { Student, Teacher, Attendance, Assignment, BusRoute, Notice, AuditLog } from '@/models';

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

  // 3. Attendance Today
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

  // 4. Pending Assignments
  const pendingAssignments = await Assignment.countDocuments({
    schoolId,
    dueDate: { $gte: startOfToday }
  });

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

  // 7. Recent Activity (Audit logs)
  const recentActivity = await AuditLog.find({ schoolId })
    .populate('userId', 'name role')
    .sort({ timestamp: -1 })
    .limit(5)
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        totalStudents,
        totalTeachers,
        attendanceToday: attendancePercentage,
        pendingAssignments,
        activeRoutes,
        recentNotices,
      },
      recentActivity,
    }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });
