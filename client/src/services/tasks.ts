import { api } from "./api";
import type { Task, TaskStatus } from "@/lib/types";

export interface CreateTaskPayload {
  title: string;
  owner: string;
  dueDate: string;
  status?: TaskStatus;
  meetingId: string;
}

export interface UpdateTaskPayload {
  title?: string;
  owner?: string;
  dueDate?: string;
  status?: TaskStatus;
}

export const tasksApi = {
  async list() {
    const { data } = await api.get<{ tasks: Task[] }>("/tasks");
    return data.tasks;
  },
  async create(payload: CreateTaskPayload) {
    const { data } = await api.post<{ task: Task }>("/tasks", payload);
    return data.task;
  },
  async update(id: string, payload: UpdateTaskPayload) {
    const { data } = await api.patch<{ task: Task }>(`/tasks/${id}`, payload);
    return data.task;
  },
  async remove(id: string) {
    await api.delete(`/tasks/${id}`);
  },
  markComplete(id: string) {
    return this.update(id, { status: "DONE" });
  }
};
