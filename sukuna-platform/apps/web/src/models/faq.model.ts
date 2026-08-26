import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  schoolId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  category: 'GENERAL' | 'ADMISSIONS' | 'PAYMENTS' | 'RESULTS' | 'LIBRARY' | 'ATTENDANCE' | 'RESEARCH' | 'ACCOUNT' | 'MEMORIES' | 'TRANSPORT';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['GENERAL', 'ADMISSIONS', 'PAYMENTS', 'RESULTS', 'LIBRARY', 'ATTENDANCE', 'RESEARCH', 'ACCOUNT', 'MEMORIES', 'TRANSPORT'],
      required: true 
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const FAQ = (mongoose.models.FAQ as mongoose.Model<IFAQ>) || mongoose.model<IFAQ>('FAQ', FAQSchema);
