import { api } from "./api";
import type { User } from "@/lib/types";

export interface AuthPayload {
  user: User;
  accessToken: string;
}

export const authApi = {
  login(email: string, password: string) {
    return api.post<AuthPayload>("/auth/login", { email, password });
  },
  register(name: string, email: string, password: string) {
    return api.post<AuthPayload>("/auth/register", { name, email, password });
  }
};
