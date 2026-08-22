import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  userId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  teacherId: string;
  subjects: string[];
  assignedClasses: { grade: string; section: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    teacherId: { type: String, required: true, unique: true },
    subjects: [{ type: String }],
    assignedClasses: [
      {
        grade: { type: String },
        section: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Teacher: mongoose.Model<ITeacher> = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);
