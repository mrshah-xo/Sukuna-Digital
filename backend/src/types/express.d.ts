import { Document } from 'mongoose';

export type Role = 'ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'DRIVER' | 'STAFF';

export interface AuthenticatedUser {
  id: string;
  role: Role;
  schoolId: string;
}

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
    interface Request {
      user?: User;
    }
  }
}
