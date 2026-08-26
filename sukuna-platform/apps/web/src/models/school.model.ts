import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool extends Document {
  schoolName: string;
  schoolCode: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE';
  branding?: {
    appName?: string;
    logo?: string;
    coverImage?: string;
    primaryColor?: string;
    secondaryColor?: string;
    favicon?: string;
    schoolMotto?: string;
    welcomeMessage?: string;
    frame2Title?: string;
    frame2Description?: string;
    frame2Image?: string;
    homePageHeroBanner?: string;
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
    otpConfig?: {
      messageTemplate?: string;
      codeLength?: number;
      sessionTimeout?: number;
      maxAttempts?: number;
    };
    notificationConfig?: {
      smsOtp?: boolean;
      pushNotices?: boolean;
      pushResults?: boolean;
      paymentReminders?: boolean;
      researchAlerts?: boolean;
      newDeviceAlert?: boolean;
    };
  };
  versionHistory?: {
    version: string;
    date: Date;
    description: string;
    updatedBy: mongoose.Types.ObjectId;
  }[];
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
      appName: String,
      logo: String,
      coverImage: String,
      primaryColor: String,
      secondaryColor: String,
      favicon: String,
      schoolMotto: String,
      welcomeMessage: String,
      frame2Title: String,
      frame2Description: String,
      frame2Image: String,
      homePageHeroBanner: String,
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
      otpConfig: {
        messageTemplate: { type: String, default: 'Your Sukuna School verification code is: {OTP}. Valid for 5 minutes. Do not share this code.' },
        codeLength: { type: Number, default: 6 },
        sessionTimeout: { type: Number, default: 30 },
        maxAttempts: { type: Number, default: 5 }
      },
      notificationConfig: {
        smsOtp: { type: Boolean, default: true },
        pushNotices: { type: Boolean, default: true },
        pushResults: { type: Boolean, default: true },
        paymentReminders: { type: Boolean, default: true },
        researchAlerts: { type: Boolean, default: true },
        newDeviceAlert: { type: Boolean, default: false }
      }
    },
    versionHistory: [{
      version: String,
      date: { type: Date, default: Date.now },
      description: String,
      updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    }]
  },
  { timestamps: true }
);

export const School = (mongoose.models.School as mongoose.Model<ISchool>) || 
  mongoose.model<ISchool>('School', SchoolSchema);
