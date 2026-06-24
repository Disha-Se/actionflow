import type { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { env } from "../utils/env.js";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

interface AccessTokenPayload {
  sub: string;
  email: string;
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    (req as AuthenticatedRequest).user = {
      id: payload.sub,
      email: payload.email
    };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
};
