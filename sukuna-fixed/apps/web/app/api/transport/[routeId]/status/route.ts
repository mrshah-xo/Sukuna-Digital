import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BusRoute } from '@/models';
import { auth } from '@/lib/auth';
import { notificationService } from '@/services/notification.service';

// PATCH /api/transport/[routeId]/status — Called by driver app or admin
export async function PATCH(req: Request, { params }: { params: { routeId: string } }) {
  try {
    const session = await auth();
    if (!session || !['ADMIN', 'DRIVER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const { status, delayMinutes, delayReason, currentLocation } = await req.json();

    const route = await BusRoute.findById(params.routeId);
    if (!route) return NextResponse.json({ error: 'Route not found' }, { status: 404 });

    route.status = status ?? route.status;
    if (delayMinutes !== undefined) route.delayMinutes = delayMinutes;
    if (delayReason) route.delayReason = delayReason;
    if (currentLocation) route.currentLocation = { ...currentLocation, updatedAt: new Date() };
    await route.save();

    // Notify all assigned students & parents if DELAYED or CANCELLED
    if (status === 'DELAYED' || status === 'CANCELLED') {
      const schoolId = session.user.schoolId;
      
      for (const studentId of route.assignedStudents) {
        // Notify Student
        await notificationService.dispatch({
          schoolId,
          userId: studentId.toString(),
          title: status === 'DELAYED' ? `Bus Delayed — ${route.routeName}` : `Bus Cancelled — ${route.routeName}`,
          message: status === 'DELAYED'
            ? `Your bus (Route ${route.routeNumber}) is delayed by ${delayMinutes} minutes. ${delayReason || ''}`
            : `Your bus route (${route.routeNumber}) has been cancelled today. ${delayReason || ''}`,
          type: 'TRANSPORT',
          priority: 'CRITICAL',
          channels: ['IN_APP', 'PUSH', 'SMS'],
        });
      }
    }

    return NextResponse.json({ message: 'Status updated', route }, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/transport/[routeId]/status — Get current status & location
export async function GET(_: Request, { params }: { params: { routeId: string } }) {
  try {
    await connectDB();
    const route = await BusRoute.findById(params.routeId, {
      routeName: 1, routeNumber: 1, status: 1, 
      delayMinutes: 1, delayReason: 1, currentLocation: 1, stops: 1,
    });
    if (!route) return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    return NextResponse.json({ route }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
