import { Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { Task, TaskStatus } from "@/lib/types";
import { tasksApi } from "@/services/tasks";

export const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    const result = await tasksApi.list();
    setTasks(result);
  };

  useEffect(() => {
    void loadTasks().finally(() => setIsLoading(false));
  }, []);

  const updateStatus = async (task: Task, status: TaskStatus) => {
    const updated = await tasksApi.update(task.id, { status });
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, ...updated } : item)));
  };

  const deleteTask = async (taskId: string) => {
    await tasksApi.remove(taskId);
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Tasks</h1>
        <p className="text-muted-foreground">Manage every action item across your meetings.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All tasks</CardTitle>
          <CardDescription>Update status, mark complete, or remove obsolete tasks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? <p className="text-sm text-muted-foreground">Loading tasks...</p> : null}
          {tasks.map((task) => (
            <div key={task.id} className="grid gap-3 rounded-md border p-4 lg:grid-cols-[1fr_180px_120px] lg:items-center">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{task.title}</p>
                  <StatusBadge status={task.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {task.owner} · {task.meeting?.title ?? "Meeting"} · Due {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <Select value={task.status} onChange={(event) => void updateStatus(task, event.target.value as TaskStatus)}>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="DONE">Done</option>
              </Select>
              <div className="flex gap-2 lg:justify-end">
                <Button variant="outline" size="icon" onClick={() => void updateStatus(task, "DONE")} aria-label="Mark complete">
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => void deleteTask(task.id)} aria-label="Delete task">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {!isLoading && tasks.length === 0 ? <p className="text-sm text-muted-foreground">No tasks yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
};
