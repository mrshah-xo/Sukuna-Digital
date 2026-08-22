import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool extends Document {
  schoolName: string;
  schoolCode: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE';
  branding?: {
    logo?: string;
    coverImage?: string;
    primaryColor?: string;
    secondaryColor?: string;
    favicon?: string;
    schoolMotto?: string;
  };
  subscription?: {
    planType: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    validUntil?: Date;
    maxStudents?: number;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  };
  settings?: {
    featuresEnabled: string[];
    academicYear?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema = new Schema<ISchool>(
  {
    schoolName: { type: String, required: true },
    schoolCode: { type: String, unique: true, sparse: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    branding: {
      logo: String,
      coverImage: String,
      primaryColor: String,
      secondaryColor: String,
      favicon: String,
      schoolMotto: String,
    },
    subscription: {
      planType: { type: String, enum: ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'], default: 'FREE' },
      validUntil: Date,
      maxStudents: Number,
      status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE' },
    },
    settings: {
      featuresEnabled: [String],
      academicYear: String,
    }
  },
  { timestamps: true }
);

export const School = (mongoose.models.School as mongoose.Model<ISchool>) || 
  mongoose.model<ISchool>('School', SchoolSchema);
