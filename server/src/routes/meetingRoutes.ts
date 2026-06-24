import { Router } from "express";
import {
  createMeeting,
  deleteMeeting,
  getMeeting,
  listMeetings
} from "../controllers/meetingController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createMeetingSchema, idParamSchema } from "../utils/validationSchemas.js";

export const meetingRouter = Router();

meetingRouter.use(requireAuth);

meetingRouter.get("/", asyncHandler(listMeetings));
meetingRouter.post("/", validate(createMeetingSchema), asyncHandler(createMeeting));
meetingRouter.get("/:id", validate(idParamSchema), asyncHandler(getMeeting));
meetingRouter.delete("/:id", validate(idParamSchema), asyncHandler(deleteMeeting));
