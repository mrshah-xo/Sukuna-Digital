import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  schoolId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  role: 'STUDENT' | 'TEACHER' | 'STAFF' | 'ADMIN' | 'PRINCIPAL' | 'PARENT' | 'DRIVER';
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  notificationPreferences: {
    push: boolean;
    email: boolean;
    sms: boolean;
    transport: boolean;
    assignment: boolean;
    result: boolean;
  };
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true },
    phone: { type: String, unique: true, required: true, index: true },
    role: {
      type: String,
      enum: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN', 'PRINCIPAL', 'PARENT', 'DRIVER'],
      required: true,
    },
    notificationPreferences: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      transport: { type: Boolean, default: true },
      assignment: { type: Boolean, default: true },
      result: { type: Boolean, default: true },
    },
    avatar: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const User: mongoose.Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
