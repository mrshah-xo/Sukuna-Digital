import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  schoolId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  originalName: string;
  storageName: string;
  url: string;
  storageProvider: string;
  mimeType: string;
  size: number;
  category: 'BRANDING' | 'LOGIN_SLIDER' | 'PAYMENT_QR' | 'PAYMENT_PROOF' | 'NOTICE' | 'RESOURCE' | 'OTHER';
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    storageName: { type: String, required: true },
    url: { type: String, required: true },
    storageProvider: { type: String, default: 'LOCAL' },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    category: { 
      type: String, 
      enum: ['BRANDING', 'LOGIN_SLIDER', 'PAYMENT_QR', 'PAYMENT_PROOF', 'NOTICE', 'RESOURCE', 'OTHER'],
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

export const Media = (mongoose.models.Media as mongoose.Model<IMedia>) || mongoose.model<IMedia>('Media', MediaSchema);
