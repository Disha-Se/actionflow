export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  notes: string;
  createdBy: string;
  createdAt: string;
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  meetingId: string;
  createdAt: string;
  meeting?: {
    id: string;
    title: string;
  };
}

export interface DashboardStats {
  totalMeetings: number;
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
  overdueTasks: number;
}
