import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { meetingService } from "../services/meetingService.js";

export const listMeetings = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  const meetings = await meetingService.listMeetings(user.id);
  res.status(200).json({ meetings });
};

export const createMeeting = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  const meeting = await meetingService.createMeeting(user.id, req.body);
  res.status(201).json({ meeting });
};

export const getMeeting = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  const meeting = await meetingService.getMeeting(
  user.id,
  req.params.id!
);
  res.status(200).json({ meeting });
};

export const deleteMeeting = async (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  await meetingService.deleteMeeting(
  user.id,
  req.params.id!
);
  res.status(204).send();
};
