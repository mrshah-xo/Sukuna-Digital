import mongoose, { Schema, Document } from 'mongoose';

export interface ILiveSession extends Document {
  schoolId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  title: string;
  targetClass: { grade: string; section?: string };
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  scheduledFor: Date;
  messages: {
    senderId: mongoose.Types.ObjectId;
    content: string;
    attachmentUrl?: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LiveSessionSchema = new Schema<ILiveSession>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    title: { type: String, required: true },
    targetClass: {
      grade: { type: String, required: true },
      section: { type: String },
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'LIVE', 'ENDED'],
      required: true,
    },
    scheduledFor: { type: Date, required: true },
    messages: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: 'User' },
        content: { type: String },
        attachmentUrl: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const LiveSession: mongoose.Model<ILiveSession> = mongoose.models.LiveSession || mongoose.model<ILiveSession>('LiveSession', LiveSessionSchema);
