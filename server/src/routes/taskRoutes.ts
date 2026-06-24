import { Router } from "express";
import { createTask, deleteTask, listTasks, updateTask } from "../controllers/taskController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createTaskSchema, idParamSchema, updateTaskSchema } from "../utils/validationSchemas.js";

export const taskRouter = Router();

taskRouter.use(requireAuth);

taskRouter.get("/", asyncHandler(listTasks));
taskRouter.post("/", validate(createTaskSchema), asyncHandler(createTask));
taskRouter.patch("/:id", validate(updateTaskSchema), asyncHandler(updateTask));
taskRouter.delete("/:id", validate(idParamSchema), asyncHandler(deleteTask));
