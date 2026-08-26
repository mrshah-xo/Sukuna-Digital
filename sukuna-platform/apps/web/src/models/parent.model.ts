import mongoose, { Schema, Document } from 'mongoose';

export interface IParent extends Document {
  userId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  parentId: string;
  children: mongoose.Types.ObjectId[];
  relationship?: string;
  emergencyContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ParentSchema = new Schema<IParent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    parentId: { type: String, required: true, unique: true },
    children: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    relationship: { type: String },
    emergencyContact: { type: String },
  },
  { timestamps: true }
);

export const Parent: mongoose.Model<IParent> = mongoose.models.Parent || mongoose.model<IParent>('Parent', ParentSchema);
