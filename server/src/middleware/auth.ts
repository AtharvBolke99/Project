import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { db } from '../database/db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'STUDENT' | 'ADMIN';
    name: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || (req.query.token as string);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      role: 'STUDENT' | 'ADMIN';
      name: string;
    };

    const user = db.findOne('users', u => u.id === decoded.id && u.status === 'ACTIVE');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or user account suspended.'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  let token = (authHeader && authHeader.split(' ')[1]) || (req.query.token as string);

  if (token) {
    token = token.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '').trim();
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      const user = db.findOne('users', u => u.id === decoded.id);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        };
      }
    } catch (e) {}
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: Admin privileges required.'
    });
  }
  next();
};
