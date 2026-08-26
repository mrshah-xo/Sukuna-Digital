import mongoose, { Schema, Document } from 'mongoose';

export interface IImportJob extends Document {
  schoolId: mongoose.Types.ObjectId;
  type: 'STUDENT' | 'TEACHER' | 'STAFF';
  status: 'PENDING' | 'SUCCESS' | 'PARTIAL' | 'FAILED';
  fileName: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errorReportUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ImportJobSchema = new Schema<IImportJob>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    type: { type: String, enum: ['STUDENT', 'TEACHER', 'STAFF'], required: true },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'PARTIAL', 'FAILED'], default: 'PENDING' },
    fileName: { type: String, required: true },
    totalRecords: { type: Number, default: 0 },
    successfulRecords: { type: Number, default: 0 },
    failedRecords: { type: Number, default: 0 },
    errorReportUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const ImportJob = (mongoose.models.ImportJob as mongoose.Model<IImportJob>) || mongoose.model<IImportJob>('ImportJob', ImportJobSchema);
