import mongoose, { Schema, Document } from 'mongoose';

export interface IMemory extends Document {
  schoolId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'ACADEMIC' | 'SPORTS' | 'CULTURAL' | 'TOUR' | 'GRADUATION' | 'ACHIEVEMENT' | 'COMPETITION' | 'CELEBRATION' | 'ANNIVERSARY' | 'HISTORICAL' | 'OTHER';
  eventDate: Date;
  academicYear: string; // e.g., '2025-2026'
  coverImage: string; // URL to cloud storage
  mediaFiles: { url: string; type: 'IMAGE' | 'VIDEO' | 'PDF' }[];
  createdBy: mongoose.Types.ObjectId; // Admin/Teacher who created it
  visibility: 'PUBLIC' | 'SCHOOL' | 'GRADE' | 'CLASS' | 'PRIVATE';
  tags: string[];
  location?: string;
  isFeatured: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const MemorySchema = new Schema<IMemory>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['ACADEMIC', 'SPORTS', 'CULTURAL', 'TOUR', 'GRADUATION', 'ACHIEVEMENT', 'COMPETITION', 'CELEBRATION', 'ANNIVERSARY', 'HISTORICAL', 'OTHER'],
      required: true,
    },
    eventDate: { type: Date, required: true },
    academicYear: { type: String, required: true },
    coverImage: { type: String, required: true },
    mediaFiles: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ['IMAGE', 'VIDEO', 'PDF'], required: true },
      }
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    visibility: {
      type: String,
      enum: ['PUBLIC', 'SCHOOL', 'GRADE', 'CLASS', 'PRIVATE'],
      default: 'SCHOOL',
    },
    tags: [{ type: String }],
    location: { type: String },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'APPROVED' },
  },
  { timestamps: true }
);

// Indexes for fast Timeline and Category searching
MemorySchema.index({ schoolId: 1, eventDate: -1 });
MemorySchema.index({ schoolId: 1, academicYear: -1 });
MemorySchema.index({ schoolId: 1, category: 1 });
MemorySchema.index({ schoolId: 1, status: 1 });

export const Memory: mongoose.Model<IMemory> = mongoose.models.Memory || mongoose.model<IMemory>('Memory', MemorySchema);
