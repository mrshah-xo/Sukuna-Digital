import mongoose, { Schema, Document } from 'mongoose';

export interface IResearchProject extends Document {
  schoolId: mongoose.Types.ObjectId;
  title: string;
  abstract: string;
  authorId: mongoose.Types.ObjectId;
  category: 'STUDENT_RESEARCH' | 'TEACHER_RESEARCH' | 'SCIENCE_PROJECT' | 'INNOVATION' | 'ACADEMIC_PAPER';
  documentUrl: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'FEATURED' | 'REJECTED';
  approvedBy?: mongoose.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResearchProjectSchema = new Schema<IResearchProject>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['STUDENT_RESEARCH', 'TEACHER_RESEARCH', 'SCIENCE_PROJECT', 'INNOVATION', 'ACADEMIC_PAPER'], required: true },
    documentUrl: { type: String, required: true },
    status: { type: String, enum: ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'FEATURED', 'REJECTED'], default: 'DRAFT', index: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export const ResearchProject = (mongoose.models.ResearchProject as mongoose.Model<IResearchProject>) || mongoose.model<IResearchProject>('ResearchProject', ResearchProjectSchema);
