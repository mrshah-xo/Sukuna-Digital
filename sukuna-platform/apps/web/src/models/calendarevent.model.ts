import mongoose, { Schema, Document } from 'mongoose';

export interface ICalendarEvent extends Document {
  schoolId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: 'EXAM' | 'HOLIDAY' | 'EVENT' | 'SPORTS';
  date: Date;
  endDate?: Date;
  color?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CalendarEventSchema = new Schema<ICalendarEvent>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['EXAM', 'HOLIDAY', 'EVENT', 'SPORTS'], required: true },
    date: { type: Date, required: true, index: true },
    endDate: { type: Date },
    color: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const CalendarEvent = (mongoose.models.CalendarEvent as mongoose.Model<ICalendarEvent>) || mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
