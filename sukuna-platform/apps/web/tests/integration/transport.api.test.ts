import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { GET, PATCH } from '../../app/api/transport/[routeId]/status/route';
import { BusRoute } from '@/models';
import { mockAuthFn } from '../setup/auth-mock';
import { createAdmin, createDriver, createSchool } from '../setup/factories';
import { useTestDb, testDbAvailable } from '../setup/integration-hooks';
import { callRoute } from '../setup/request';

async function createRoute(schoolId: mongoose.Types.ObjectId, driverId: mongoose.Types.ObjectId) {
  return BusRoute.create({
    schoolId,
    routeName: 'North Route',
    routeNumber: 'BUS-01',
    driverId,
    vehicleNumber: 'BA-1-PA-1000',
    vehicleCapacity: 35,
    stops: [{ name: 'Gate', order: 1, estimatedTime: '07:30 AM' }],
    assignedStudents: [],
    status: 'ACTIVE',
  });
}

describe.skipIf(!testDbAvailable())('/api/transport/[routeId]/status (integration)', () => {
  useTestDb();

  it('returns 401 with no session', async () => {
    const routeId = new mongoose.Types.ObjectId().toString();
    mockAuthFn.mockResolvedValue(null);

    const { status, body } = await callRoute(GET, 'GET', `http://localhost/api/transport/${routeId}/status`, {
      params: { routeId },
    });

    expect(status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('does not reveal a route from another school', async () => {
    const schoolA = await createSchool({ schoolName: 'School A' });
    const schoolB = await createSchool({ schoolName: 'School B' });
    const { session: adminASession } = await createAdmin(schoolA._id);
    const { user: driverB } = await createDriver(schoolB._id);
    const routeB = await createRoute(schoolB._id, driverB._id);

    mockAuthFn.mockResolvedValue(adminASession);
    const { status, body } = await callRoute(GET, 'GET', `http://localhost/api/transport/${routeB._id}/status`, {
      params: { routeId: routeB._id.toString() },
    });

    expect(status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('prevents a driver from updating another driver route in the same school', async () => {
    const school = await createSchool();
    const { user: assignedDriver } = await createDriver(school._id, { name: 'Assigned Driver' });
    const { session: otherDriverSession } = await createDriver(school._id, { name: 'Other Driver' });
    const route = await createRoute(school._id, assignedDriver._id);

    mockAuthFn.mockResolvedValue(otherDriverSession);
    const { status } = await callRoute(PATCH, 'PATCH', `http://localhost/api/transport/${route._id}/status`, {
      params: { routeId: route._id.toString() },
      body: { status: 'DELAYED', delayMinutes: 15 },
    });

    expect(status).toBe(404);
    const unchanged = await BusRoute.findById(route._id);
    expect(unchanged?.status).toBe('ACTIVE');
  });

  it('allows the assigned driver to update route status with validated data', async () => {
    const school = await createSchool();
    const { user: driver, session } = await createDriver(school._id);
    const route = await createRoute(school._id, driver._id);

    mockAuthFn.mockResolvedValue(session);
    const { status, body } = await callRoute(PATCH, 'PATCH', `http://localhost/api/transport/${route._id}/status`, {
      params: { routeId: route._id.toString() },
      body: { status: 'DELAYED', delayMinutes: 10, currentLocation: { lat: 27.7172, lng: 85.3240 } },
    });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.route.status).toBe('DELAYED');
  });
});
