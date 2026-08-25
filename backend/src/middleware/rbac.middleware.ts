import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { Role } from '../types/express';

export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized — Please sign in', 'UNAUTHORIZED'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Forbidden — ${req.user.role} cannot access this resource`, 'FORBIDDEN'));
    }
    next();
  };
};
