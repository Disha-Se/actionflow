import { Check, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Meeting, Task, TaskStatus } from "@/lib/types";
import { meetingsApi } from "@/services/meetings";
import { tasksApi } from "@/services/tasks";

const toApiDate = (value: string) => new Date(value).toISOString();

export const MeetingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("OPEN");

  const loadMeeting = async () => {
    if (!id) return;
    const result = await meetingsApi.get(id);
    setMeeting(result);
  };

  useEffect(() => {
    void loadMeeting();
  }, [id]);

  const createTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;

    await tasksApi.create({
      title,
      owner,
      dueDate: toApiDate(dueDate),
      status,
      meetingId: id
    });
    setTitle("");
    setOwner("");
    setDueDate("");
    setStatus("OPEN");
    await loadMeeting();
  };

  const updateStatus = async (task: Task, nextStatus: TaskStatus) => {
    await tasksApi.update(task.id, { status: nextStatus });
    await loadMeeting();
  };

  const deleteTask = async (taskId: string) => {
    await tasksApi.remove(taskId);
    await loadMeeting();
  };

  if (!meeting) {
    return <p className="text-sm text-muted-foreground">Loading meeting...</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{meeting.title}</CardTitle>
            <CardDescription>{new Date(meeting.createdAt).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{meeting.notes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Action items</CardTitle>
            <CardDescription>{meeting.tasks?.length ?? 0} tasks captured from this meeting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {meeting.tasks?.map((task) => (
              <div key={task.id} className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{task.title}</p>
                    <StatusBadge status={task.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {task.owner} · Due {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => void updateStatus(task, "DONE")}>
                    <Check className="h-4 w-4" />
                    Done
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => void deleteTask(task.id)} aria-label="Delete task">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {meeting.tasks?.length === 0 ? <p className="text-sm text-muted-foreground">No tasks yet.</p> : null}
          </CardContent>
        </Card>
      </div>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Create task</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={createTask}>
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input id="owner" value={owner} onChange={(event) => setOwner(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="DONE">Done</option>
              </Select>
            </div>
            <Button className="w-full" type="submit">
              Add task
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
