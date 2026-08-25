import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  schoolId: mongoose.Types.ObjectId;
  type: 'POST' | 'COMMENT' | 'USER';
  targetId: mongoose.Types.ObjectId; // ID of post, comment, or user
  contentSnapshot?: string; // Text snippet of what was reported
  reportedBy: mongoose.Types.ObjectId;
  reportedUser?: mongoose.Types.ObjectId; // User who made the content
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  resolvedBy?: mongoose.Types.ObjectId;
  resolutionAction?: 'REMOVED_CONTENT' | 'WARNED_USER' | 'SUSPENDED_USER' | 'IGNORED';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    type: { type: String, enum: ['POST', 'COMMENT', 'USER'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    contentSnapshot: { type: String },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'RESOLVED', 'DISMISSED'], default: 'PENDING', index: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolutionAction: { type: String, enum: ['REMOVED_CONTENT', 'WARNED_USER', 'SUSPENDED_USER', 'IGNORED'] }
  },
  { timestamps: true }
);

export const Report = (mongoose.models.Report as mongoose.Model<IReport>) || mongoose.model<IReport>('Report', ReportSchema);
