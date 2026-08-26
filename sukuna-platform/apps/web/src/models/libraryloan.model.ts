import mongoose, { Schema, Document } from 'mongoose';

export interface ILibraryLoan extends Document {
  schoolId: mongoose.Types.ObjectId;
  resourceId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  issuedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LibraryLoanSchema = new Schema<ILibraryLoan>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    resourceId: { type: Schema.Types.ObjectId, ref: 'LibraryResource', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    borrowDate: { type: Date, default: Date.now, required: true },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ['BORROWED', 'RETURNED', 'OVERDUE'], default: 'BORROWED', index: true },
    issuedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const LibraryLoan = (mongoose.models.LibraryLoan as mongoose.Model<ILibraryLoan>) || mongoose.model<ILibraryLoan>('LibraryLoan', LibraryLoanSchema);
