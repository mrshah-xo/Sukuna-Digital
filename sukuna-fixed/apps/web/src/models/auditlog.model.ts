import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  schoolId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  targetId?: mongoose.Types.ObjectId; // The specific ID of the resource affected
  ipAddress?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed }, // flexible extra context
  },
  { timestamps: true }
);

// Indexes for Audit Log Center filters (by date, user, module)
AuditLogSchema.index({ schoolId: 1, timestamp: -1 });
AuditLogSchema.index({ schoolId: 1, userId: 1, timestamp: -1 });

export const AuditLog: mongoose.Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
