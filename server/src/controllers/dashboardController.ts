import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dashboardService } from "../services/dashboardService.js";

export const getDashboardStats = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  const stats = await dashboardService.getStats(user.id);
  res.status(200).json({ stats });
};
