import mongoose, { Schema, Document } from 'mongoose';

export interface IExamResult extends Document {
  schoolId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  subjectTeacherId: mongoose.Types.ObjectId;
  teacherRemarks?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExamResultSchema = new Schema<IExamResult>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    rank: { type: Number },
    subjectTeacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    teacherRemarks: { type: String },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// High-performance compound indexes for Analytics and Parent Dashboard
ExamResultSchema.index({ schoolId: 1, studentId: 1 });
ExamResultSchema.index({ schoolId: 1, examId: 1 });
ExamResultSchema.index({ schoolId: 1, subject: 1, percentage: -1 });

export const ExamResult: mongoose.Model<IExamResult> = mongoose.models.ExamResult || mongoose.model<IExamResult>('ExamResult', ExamResultSchema);
