import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  schoolId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  title?: string;
  content: string;
  media: string[];
  category: 'TEACHER_UPDATE' | 'ACHIEVEMENT' | 'EVENT' | 'EDUCATIONAL' | 'ANNOUNCEMENT';
  visibility: 'SCHOOL' | 'CLASS' | 'GRADE';
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  isFeatured: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    content: { type: String, required: true },
    media: [{ type: String }],
    category: {
      type: String,
      enum: ['TEACHER_UPDATE', 'ACHIEVEMENT', 'EVENT', 'EDUCATIONAL', 'ANNOUNCEMENT'],
      required: true,
    },
    visibility: {
      type: String,
      enum: ['SCHOOL', 'CLASS', 'GRADE'],
      default: 'SCHOOL',
    },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'APPROVED' },
  },
  { timestamps: true }
);

export const Post: mongoose.Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
