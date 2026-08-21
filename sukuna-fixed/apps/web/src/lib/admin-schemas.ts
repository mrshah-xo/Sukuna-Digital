/**
 * Shared Zod validation schemas for admin CRUD routes.
 *
 * Exported from a dedicated module (not from the route files) so that:
 *   1. Mass-assignment unit tests can import them directly.
 *   2. Next.js route type checking does not flag non-handler exports
 *      in .next/types/app/api/.../route.ts generated stubs.
 */
import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be valid'),
  studentId: z.string().min(1, 'Student ID is required'),
  grade: z.string().min(1, 'Grade is required'),
  section: z.string().min(1, 'Section is required'),
}).strict();

export const updateStudentSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  studentId: z.string().min(1).optional(),
  grade: z.string().min(1).optional(),
  section: z.string().min(1).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
}).strict();

export const createTeacherSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be valid'),
  teacherId: z.string().min(1, 'Teacher ID is required'),
  subjects: z.array(z.string()).optional(),
  assignedClasses: z.array(
    z.object({
      grade: z.string(),
      section: z.string(),
    })
  ).optional(),
}).strict();

export const updateTeacherSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  teacherId: z.string().min(1).optional(),
  subjects: z.array(z.string()).optional(),
  assignedClasses: z.array(
    z.object({
      grade: z.string(),
      section: z.string(),
    })
  ).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
}).strict();

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;
