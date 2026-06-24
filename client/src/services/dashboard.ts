import { api } from "./api";
import type { DashboardStats } from "@/lib/types";

export const dashboardApi = {
  async getStats() {
    const { data } = await api.get<{ stats: DashboardStats }>("/dashboard");
    return data.stats;
  }
};
