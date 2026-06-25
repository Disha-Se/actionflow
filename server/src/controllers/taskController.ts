import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { taskService } from "../services/taskService.js";

export const listTasks = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  const tasks = await taskService.listTasks(user.id);
  res.status(200).json({ tasks });
};

export const createTask = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  const task = await taskService.createTask(user.id, req.body);
  res.status(201).json({ task });
};

export const updateTask = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  const task = await taskService.updateTask(
  user.id,
  req.params.id!,
  req.body
);
  res.status(200).json({ task });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  await taskService.deleteTask(
  user.id,
  req.params.id!
);
  res.status(204).send();
};
