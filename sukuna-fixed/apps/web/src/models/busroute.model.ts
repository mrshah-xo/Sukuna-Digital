import mongoose, { Schema, Document } from 'mongoose';

export interface IBusRoute extends Document {
  schoolId: mongoose.Types.ObjectId;
  routeName: string;
  routeNumber: string;
  driverId: mongoose.Types.ObjectId;
  vehicleNumber: string;
  vehicleCapacity: number;
  stops: {
    name: string;
    order: number;
    estimatedTime: string; // e.g., "07:30 AM"
    coordinates?: { lat: number; lng: number };
  }[];
  assignedStudents: mongoose.Types.ObjectId[];
  status: 'ACTIVE' | 'INACTIVE' | 'DELAYED' | 'CANCELLED';
  delayMinutes?: number;
  delayReason?: string;
  isTracking: boolean;
  currentLocation?: { lat: number; lng: number; updatedAt: Date };
  createdAt: Date;
  updatedAt: Date;
}

const BusRouteSchema = new Schema<IBusRoute>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    routeName: { type: String, required: true },
    routeNumber: { type: String, required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleNumber: { type: String, required: true },
    vehicleCapacity: { type: Number, required: true },
    stops: [
      {
        name: { type: String, required: true },
        order: { type: Number, required: true },
        estimatedTime: { type: String, required: true },
        coordinates: {
          lat: { type: Number },
          lng: { type: Number },
        },
      },
    ],
    assignedStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DELAYED', 'CANCELLED'],
      default: 'ACTIVE',
    },
    delayMinutes: { type: Number },
    delayReason: { type: String },
    isTracking: { type: Boolean, default: false },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
      updatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

BusRouteSchema.index({ schoolId: 1, status: 1 });

export const BusRoute: mongoose.Model<IBusRoute> = mongoose.models.BusRoute || mongoose.model<IBusRoute>('BusRoute', BusRouteSchema);
