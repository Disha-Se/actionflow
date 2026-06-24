import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { api } from "../services/api";
import type { User } from "./types";

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const tokenKey = "actionflow_token";
const userKey = "actionflow_user";

const readStoredUser = () => {
  const rawUser = localStorage.getItem(userKey);
  return rawUser ? (JSON.parse(rawUser) as User) : null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(tokenKey));
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  const persistSession = (response: AuthResponse) => {
    localStorage.setItem(tokenKey, response.accessToken);
    localStorage.setItem(userKey, JSON.stringify(response.user));
    setToken(response.accessToken);
    setUser(response.user);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      async login(email, password) {
        const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
        persistSession(data);
      },
      async register(name, email, password) {
        const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password });
        persistSession(data);
      },
      logout() {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        setToken(null);
        setUser(null);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
