import { AlertTriangle, CheckCircle2, ClipboardList, ListTodo, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";
import { dashboardApi } from "@/services/dashboard";

const emptyStats: DashboardStats = {
  totalMeetings: 0,
  totalTasks: 0,
  openTasks: 0,
  completedTasks: 0,
  overdueTasks: 0
};

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void dashboardApi
      .getStats()
      .then(setStats)
      .finally(() => setIsLoading(false));
  }, []);

  const cards = [
    { label: "Total Meetings", value: stats.totalMeetings, icon: Users },
    { label: "Total Tasks", value: stats.totalTasks, icon: ClipboardList },
    { label: "Open Tasks", value: stats.openTasks, icon: ListTodo },
    { label: "Completed Tasks", value: stats.completedTasks, icon: CheckCircle2 },
    { label: "Overdue Tasks", value: stats.overdueTasks, icon: AlertTriangle }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
        <p className="text-muted-foreground">Current follow-up health across your meetings.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <card.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{isLoading ? "-" : card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
