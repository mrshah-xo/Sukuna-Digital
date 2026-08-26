import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentConfig extends Document {
  schoolId: mongoose.Types.ObjectId;
  provider: 'BANK_TRANSFER' | 'ESEWA' | 'KHALTI' | 'OTHER';
  merchantName: string;
  accountNumber?: string;
  qrImageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentConfigSchema = new Schema<IPaymentConfig>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, unique: true },
    provider: { type: String, enum: ['BANK_TRANSFER', 'ESEWA', 'KHALTI', 'OTHER'], required: true },
    merchantName: { type: String, required: true },
    accountNumber: { type: String },
    qrImageUrl: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const PaymentConfig = (mongoose.models.PaymentConfig as mongoose.Model<IPaymentConfig>) || mongoose.model<IPaymentConfig>('PaymentConfig', PaymentConfigSchema);
