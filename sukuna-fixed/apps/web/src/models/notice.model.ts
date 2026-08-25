import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  schoolId: mongoose.Types.ObjectId;
  type: 'NOTICE' | 'MEMORY';
  title: string;
  content: string;
  attachments: {
    fileUrl: string;
    fileType: string;
    fileName: string;
  }[];
  targetAudience: { grade: string; section?: string }[];
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    type: { type: String, enum: ['NOTICE', 'MEMORY'], required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    attachments: [
      {
        fileUrl: { type: String },
        fileType: { type: String },
        fileName: { type: String },
      },
    ],
    targetAudience: [
      {
        grade: { type: String },
        section: { type: String },
      },
    ],
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Notice: mongoose.Model<INotice> = mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);
