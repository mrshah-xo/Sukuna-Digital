import mongoose from 'mongoose';
import { AuditLog } from '@models/auditlog.model';

export class AuditService {
  /**
   * Logs a security or administrative event.
   */
  static async logEvent(params: {
    schoolId: string | mongoose.Types.ObjectId;
    userId: string | mongoose.Types.ObjectId;
    action: string;
    resource: string;
    targetId?: string | mongoose.Types.ObjectId;
    ipAddress?: string;
    metadata?: Record<string, unknown>;
  }) {
    try {
      const logEntry = new AuditLog({
        schoolId: params.schoolId,
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        targetId: params.targetId,
        ipAddress: params.ipAddress,
        metadata: params.metadata,
      });
      await logEntry.save();
      return logEntry;
    } catch (error) {
      console.error('[AuditService Error] Failed to write audit log:', error);
      // Audit log failures shouldn't necessarily break the main transaction,
      // but should be heavily monitored.
    }
  }
}
