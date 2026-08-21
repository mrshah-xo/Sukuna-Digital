import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  schoolId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  attachments: {
    fileUrl: string;
    fileType: string;
    fileName: string;
  }[];
  targetClass: { grade: string; section?: string };
  subject: string;
  dueDate: Date;
  teacherId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    attachments: [
      {
        fileUrl: { type: String },
        fileType: { type: String },
        fileName: { type: String },
      },
    ],
    targetClass: {
      grade: { type: String, required: true },
      section: { type: String },
    },
    subject: { type: String, required: true },
    dueDate: { type: Date, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Assignment: mongoose.Model<IAssignment> = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
