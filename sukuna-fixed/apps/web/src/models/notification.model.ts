import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  schoolId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // The recipient
  title: string;
  message: string;
  type: 'ATTENDANCE' | 'ASSIGNMENT' | 'RESULT' | 'NOTICE' | 'POST' | 'LIVE_TEACHER' | 'TRANSPORT' | 'MEMORY' | 'SYSTEM' | 'SECURITY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  deliveryChannels: string[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['ATTENDANCE', 'ASSIGNMENT', 'RESULT', 'NOTICE', 'POST', 'LIVE_TEACHER', 'TRANSPORT', 'MEMORY', 'SYSTEM', 'SECURITY'],
      required: true 
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW'
    },
    deliveryChannels: [{ type: String, enum: ['IN_APP', 'PUSH', 'EMAIL', 'SMS', 'WHATSAPP'] }],
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

export const Notification: mongoose.Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
