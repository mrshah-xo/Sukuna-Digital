import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  schoolId: mongoose.Types.ObjectId;
  title: string;
  type: 'FORMATIVE' | 'SUMMATIVE';
  academicYear: string;
  termId?: string;
  date: Date;
  classes: string[]; // e.g., ["Grade 10 - A", "Grade 10 - B"]
  createdBy: mongoose.Types.ObjectId;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['FORMATIVE', 'SUMMATIVE'], required: true },
    academicYear: { type: String, required: true },
    termId: { type: String },
    date: { type: Date, required: true },
    classes: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT' },
  },
  { timestamps: true }
);

// Indexes for faster lookups per school and academic year
ExamSchema.index({ schoolId: 1, academicYear: 1, status: 1 });
ExamSchema.index({ schoolId: 1, date: -1 });

export const Exam: mongoose.Model<IExam> = mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
