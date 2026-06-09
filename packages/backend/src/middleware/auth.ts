import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userType?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireCreator = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.userType !== 'CREATOR') {
    return res.status(403).json({ error: 'Only creators can access this resource' });
  }
  next();
};

export const requireVerified = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check if user is verified (would query database if needed)
  // For now, just check if token is valid
  next();
};
