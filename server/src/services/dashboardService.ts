import { prisma } from "../utils/prisma.js";

export const dashboardService = {
  async getStats(userId: string) {
    const now = new Date();

    const [totalMeetings, totalTasks, openTasks, completedTasks, overdueTasks] = await Promise.all([
      prisma.meeting.count({
        where: { createdBy: userId }
      }),
      prisma.task.count({
        where: {
          meeting: { createdBy: userId }
        }
      }),
      prisma.task.count({
        where: {
          status: { in: ["OPEN", "IN_PROGRESS"] },
          meeting: { createdBy: userId }
        }
      }),
      prisma.task.count({
        where: {
          status: "DONE",
          meeting: { createdBy: userId }
        }
      }),
      prisma.task.count({
        where: {
          dueDate: { lt: now },
          status: { not: "DONE" },
          meeting: { createdBy: userId }
        }
      })
    ]);

    return {
      totalMeetings,
      totalTasks,
      openTasks,
      completedTasks,
      overdueTasks
    };
  }
};
