import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  studentId: string;
  grade: string;
  section: string;
  assignedBusRouteId?: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    studentId: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    assignedBusRouteId: { type: Schema.Types.ObjectId, ref: 'BusRoute' },
    parentId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Student: mongoose.Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
