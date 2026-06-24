import { AppError } from "../utils/AppError.js";
import { prisma } from "../utils/prisma.js";

interface CreateMeetingInput {
  title: string;
  notes: string;
}

export const meetingService = {
  async listMeetings(userId: string) {
    return prisma.meeting.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });
  },

  async createMeeting(userId: string, input: CreateMeetingInput) {
    return prisma.meeting.create({
      data: {
        title: input.title,
        notes: input.notes,
        createdBy: userId
      }
    });
  },

  async getMeeting(userId: string, meetingId: string) {
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        createdBy: userId
      },
      include: {
        tasks: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!meeting) {
      throw new AppError(404, "Meeting not found");
    }

    return meeting;
  },

  async deleteMeeting(userId: string, meetingId: string) {
    await this.getMeeting(userId, meetingId);
    await prisma.meeting.delete({
      where: { id: meetingId }
    });
  }
};
