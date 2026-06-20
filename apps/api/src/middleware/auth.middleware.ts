import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include our user payload
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Read the token from the HTTP-only cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback_dev_secret_do_not_use_in_prod';
    // Verify the signature
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    
    // Attach the user ID to the request so the next function can use it
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
