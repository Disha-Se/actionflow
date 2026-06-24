import { api } from "./api";
import type { Meeting } from "@/lib/types";

export const meetingsApi = {
  async list() {
    const { data } = await api.get<{ meetings: Meeting[] }>("/meetings");
    return data.meetings;
  },
  async create(payload: { title: string; notes: string }) {
    const { data } = await api.post<{ meeting: Meeting }>("/meetings", payload);
    return data.meeting;
  },
  async get(id: string) {
    const { data } = await api.get<{ meeting: Meeting }>(`/meetings/${id}`);
    return data.meeting;
  },
  async remove(id: string) {
    await api.delete(`/meetings/${id}`);
  }
};
