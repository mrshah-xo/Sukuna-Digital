import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  phone: string;
  otp: string;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
}

const OtpSchema = new Schema<IOtp>({
  phone: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-delete expired OTPs (ttl index)
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp: mongoose.Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);
