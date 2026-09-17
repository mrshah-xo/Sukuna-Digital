import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { apiHandler } from '@/lib/api-handler';
import connectDB from '@/lib/mongodb';
import { BusRoute, AuditLog } from '@/models';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req, { user }) => {
  await connectDB();

  const routes = await BusRoute.find({
    schoolId: new mongoose.Types.ObjectId(user.schoolId),
  })
    .populate('driverId', 'name phone')
    .sort({ routeNumber: 1 })
    .lean();

  const formatted = routes.map((r: any) => ({
    id: r._id.toString(),
    busNumber: r.routeNumber || r.routeName,
    routeName: r.routeName,
    driverName: r.driverId?.name || 'Assigned Driver',
    driverPhone: r.driverId?.phone || '—',
    vehicleNumber: r.vehicleNumber,
    students: r.assignedStudents?.length || 0,
    routeFrom: r.stops && r.stops.length > 0 ? r.stops[0].name : 'Campus',
    routeTo: r.stops && r.stops.length > 1 ? r.stops[r.stops.length - 1].name : 'Sukuna School',
    stops: (r.stops || []).map((s: any) => s.name),
    status: r.status,
  }));

  return NextResponse.json({
    success: true,
    data: { routes: formatted }
  });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });

const createRouteSchema = z.object({
  routeName: z.string().min(2, 'Route name is required'),
  routeNumber: z.string().min(1, 'Bus / Route number is required'),
  vehicleNumber: z.string().min(2, 'Vehicle plate number is required'),
  vehicleCapacity: z.number().min(1).default(30),
  stops: z.array(z.string()).min(1, 'At least one stop is required'),
}).strict();

export const POST = apiHandler(async (req, { user }) => {
  await connectDB();
  const body = await req.json();
  const parsed = createRouteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: parsed.error.issues[0]?.message || 'Validation failed' } },
      { status: 400 }
    );
  }

  const stopsData = parsed.data.stops.map((stopName, idx) => ({
    name: stopName,
    order: idx + 1,
    estimatedTime: '07:30 AM',
  }));

  const newRoute = await BusRoute.create({
    schoolId: user.schoolId,
    routeName: parsed.data.routeName,
    routeNumber: parsed.data.routeNumber,
    vehicleNumber: parsed.data.vehicleNumber,
    vehicleCapacity: parsed.data.vehicleCapacity,
    driverId: user.id, // Defaults to creating admin until driver user is assigned
    stops: stopsData,
    status: 'ACTIVE',
  });

  await AuditLog.create({
    schoolId: user.schoolId,
    userId: user.id,
    action: 'CREATE_BUS_ROUTE',
    resource: 'BusRoute',
    targetId: newRoute._id,
    metadata: { routeNumber: newRoute.routeNumber, routeName: newRoute.routeName }
  });

  return NextResponse.json({
    success: true,
    message: 'Bus route created successfully',
    data: {
      id: newRoute._id.toString(),
      busNumber: newRoute.routeNumber,
      routeName: newRoute.routeName,
      driverName: 'Assigned Driver',
      driverPhone: '—',
      vehicleNumber: newRoute.vehicleNumber,
      students: 0,
      routeFrom: stopsData[0]?.name || 'Campus',
      routeTo: stopsData[stopsData.length - 1]?.name || 'Sukuna School',
      stops: parsed.data.stops,
      status: 'ACTIVE',
    }
  }, { status: 201 });
}, { roles: ['ADMIN', 'PRINCIPAL'], requireSchoolId: true });
