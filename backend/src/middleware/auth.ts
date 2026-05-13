import { Request, Response, NextFunction } from 'express';
import { users } from '../data/store';
import { Role, User } from '../types';

export interface AuthRequest extends Request {
  user?: User;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || req.headers['x-user-token'];
  if (!header) {
    return res.status(401).json({ message: 'Missing authentication token' });
  }

  const token = typeof header === 'string' ? header.replace('Bearer ', '') : '';
  const user = users.find((item) => item.id === token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid authentication token' });
  }

  req.user = user;
  next();
}

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
    }
    next();
  };
}
