import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/", asyncHandler(getDashboardStats));
