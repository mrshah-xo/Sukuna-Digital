import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';

export const requireSchoolTenant = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized — Please sign in', 'UNAUTHORIZED'));
  }
  if (!req.user.schoolId) {
    return next(new ApiError(403, 'Forbidden — User does not belong to a valid school', 'NO_SCHOOL_TENANT'));
  }
  next();
};

export const assertSchoolOwnership = (resourceSchoolId: string | null | undefined, userSchoolId: string) => {
  if (!resourceSchoolId || resourceSchoolId.toString() !== userSchoolId.toString()) {
    throw new ApiError(404, 'Resource not found', 'NOT_FOUND');
  }
};
