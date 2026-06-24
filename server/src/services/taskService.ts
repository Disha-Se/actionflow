import type { TaskStatus } from "@prisma/client";
import { AppError } from "../utils/AppError.js";
import { prisma } from "../utils/prisma.js";

interface CreateTaskInput {
  title: string;
  owner: string;
  dueDate: string;
  status?: TaskStatus;
  meetingId: string;
}

interface UpdateTaskInput {
  title?: string;
  owner?: string;
  dueDate?: string;
  status?: TaskStatus;
}

const ensureMeetingOwnership = async (userId: string, meetingId: string) => {
  const meeting = await prisma.meeting.findFirst({
    where: {
      id: meetingId,
      createdBy: userId
    },
    select: { id: true }
  });

  if (!meeting) {
    throw new AppError(404, "Meeting not found");
  }
};

const findOwnedTask = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      meeting: {
        createdBy: userId
      }
    }
  });

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  return task;
};

export const taskService = {
  async listTasks(userId: string) {
    return prisma.task.findMany({
      where: {
        meeting: {
          createdBy: userId
        }
      },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
      include: {
        meeting: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
  },

  async createTask(userId: string, input: CreateTaskInput) {
    await ensureMeetingOwnership(userId, input.meetingId);

    return prisma.task.create({
      data: {
        title: input.title,
        owner: input.owner,
        dueDate: new Date(input.dueDate),
        status: input.status ?? "OPEN",
        meetingId: input.meetingId
      }
    });
  },

  async updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
    await findOwnedTask(userId, taskId);

    return prisma.task.update({
      where: { id: taskId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.owner !== undefined ? { owner: input.owner } : {}),
        ...(input.dueDate !== undefined ? { dueDate: new Date(input.dueDate) } : {}),
        ...(input.status !== undefined ? { status: input.status } : {})
      }
    });
  },

  async deleteTask(userId: string, taskId: string) {
    await findOwnedTask(userId, taskId);
    await prisma.task.delete({
      where: { id: taskId }
    });
  }
};
