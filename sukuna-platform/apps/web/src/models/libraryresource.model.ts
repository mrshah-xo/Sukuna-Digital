import mongoose, { Schema, Document } from 'mongoose';

export interface ILibraryResource extends Document {
  schoolId: mongoose.Types.ObjectId;
  title: string;
  author: string;
  type: 'BOOK' | 'EBOOK' | 'NOTE' | 'PAST_QUESTION' | 'PRACTICAL_FILE' | 'MATERIAL';
  category: string;
  totalCopies?: number; // For physical books
  availableCopies?: number; // For physical books
  fileUrl?: string; // For digital
  downloadCount?: number; // For digital
  coverImageUrl?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LibraryResourceSchema = new Schema<ILibraryResource>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    type: { type: String, enum: ['BOOK', 'EBOOK', 'NOTE', 'PAST_QUESTION', 'PRACTICAL_FILE', 'MATERIAL'], required: true, index: true },
    category: { type: String, required: true },
    totalCopies: { type: Number },
    availableCopies: { type: Number },
    fileUrl: { type: String },
    downloadCount: { type: Number, default: 0 },
    coverImageUrl: { type: String },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const LibraryResource = (mongoose.models.LibraryResource as mongoose.Model<ILibraryResource>) || mongoose.model<ILibraryResource>('LibraryResource', LibraryResourceSchema);
