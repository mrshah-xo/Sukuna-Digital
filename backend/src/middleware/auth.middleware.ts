import { Request, Response, NextFunction } from 'express';
import passportAuth from 'passport';
import { ApiError } from '../utils/api-error';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  passportAuth.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return next(new ApiError(401, 'Unauthorized — Please sign in', 'UNAUTHORIZED'));
    req.user = user;
    next();
  })(req, res, next);
};
