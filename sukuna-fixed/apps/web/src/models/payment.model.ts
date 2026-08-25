import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  schoolId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  feeType: 'SCHOOL_FEE' | 'BUS_FEE' | 'EXAM_FEE' | 'OTHER';
  amount: number;
  date: Date;
  method: 'BANK_TRANSFER' | 'ONLINE' | 'CASH';
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'REJECTED';
  receiptNumber?: string;
  proofImageUrl?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    feeType: { type: String, enum: ['SCHOOL_FEE', 'BUS_FEE', 'EXAM_FEE', 'OTHER'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    method: { type: String, enum: ['BANK_TRANSFER', 'ONLINE', 'CASH'], required: true },
    status: { type: String, enum: ['PAID', 'PENDING', 'OVERDUE', 'REJECTED'], default: 'PENDING', index: true },
    receiptNumber: { type: String },
    proofImageUrl: { type: String },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Payment = (mongoose.models.Payment as mongoose.Model<IPayment>) || mongoose.model<IPayment>('Payment', PaymentSchema);
