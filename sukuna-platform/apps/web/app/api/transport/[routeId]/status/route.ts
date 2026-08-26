import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import { BusRoute } from '@/models';
import { apiHandler, ApiError } from '@/lib/api-handler';
import { notificationService } from '@/services/notification.service';

export const dynamic = 'force-dynamic';

const routeStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'DELAYED', 'CANCELLED']).optional(),
  delayMinutes: z.number().int().min(0).max(1440).optional(),
  delayReason: z.string().trim().max(500).optional(),
  currentLocation: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
}).strict();

function requireValidRouteId(routeId: string | undefined): string {
  if (!routeId || !mongoose.Types.ObjectId.isValid(routeId)) {
    throw new ApiError(400, 'Invalid route ID', 'BAD_REQUEST');
  }
  return routeId;
}

// PATCH /api/transport/[routeId]/status - called by the assigned driver or school admin.
export const PATCH = apiHandler<z.infer<typeof routeStatusSchema>>(async (_req, { params, user, validatedData }) => {
  await connectDB();
  const routeId = requireValidRouteId(params.routeId);

  const route = await BusRoute.findOne({ _id: routeId, schoolId: user.schoolId });
  if (!route) {
    throw new ApiError(404, 'Route not found', 'NOT_FOUND');
  }

  if (user.role === 'DRIVER' && route.driverId.toString() !== user.id) {
    throw new ApiError(404, 'Route not found', 'NOT_FOUND');
  }

  const { status, delayMinutes, delayReason, currentLocation } = validatedData;

  route.status = status ?? route.status;
  if (delayMinutes !== undefined) route.delayMinutes = delayMinutes;
  if (delayReason !== undefined) route.delayReason = delayReason;
  if (currentLocation) route.currentLocation = { ...currentLocation, updatedAt: new Date() };
  await route.save();

  if (status === 'DELAYED' || status === 'CANCELLED') {
    for (const studentId of route.assignedStudents) {
      await notificationService.dispatch({
        schoolId: user.schoolId,
        userId: studentId.toString(),
        title: status === 'DELAYED' ? `Bus Delayed - ${route.routeName}` : `Bus Cancelled - ${route.routeName}`,
        message: status === 'DELAYED'
          ? `Your bus (Route ${route.routeNumber}) is delayed by ${delayMinutes ?? 0} minutes. ${delayReason || ''}`
          : `Your bus route (${route.routeNumber}) has been cancelled today. ${delayReason || ''}`,
        type: 'TRANSPORT',
        priority: 'CRITICAL',
        channels: ['IN_APP', 'PUSH', 'SMS'],
      });
    }
  }

  return NextResponse.json({ success: true, data: { route } }, { status: 200 });
}, { roles: ['ADMIN', 'PRINCIPAL', 'DRIVER'], requireSchoolId: true, schema: routeStatusSchema });

// GET /api/transport/[routeId]/status - get current status and location.
export const GET = apiHandler(async (_req, { params, user }) => {
  await connectDB();
  const routeId = requireValidRouteId(params.routeId);

  const route = await BusRoute.findOne(
    { _id: routeId, schoolId: user.schoolId },
    {
      routeName: 1,
      routeNumber: 1,
      status: 1,
      delayMinutes: 1,
      delayReason: 1,
      currentLocation: 1,
      stops: 1,
    }
  ).lean();

  if (!route) {
    throw new ApiError(404, 'Route not found', 'NOT_FOUND');
  }

  return NextResponse.json({ success: true, data: { route } }, { status: 200 });
}, { roles: ['ADMIN', 'PRINCIPAL', 'DRIVER', 'STUDENT', 'PARENT'], requireSchoolId: true });
