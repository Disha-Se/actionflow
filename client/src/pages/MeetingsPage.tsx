import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Meeting } from "@/lib/types";
import { meetingsApi } from "@/services/meetings";

export const MeetingsPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMeetings = async () => {
    const result = await meetingsApi.list();
    setMeetings(result);
  };

  useEffect(() => {
    void loadMeetings().finally(() => setIsLoading(false));
  }, []);

  const deleteMeeting = async (id: string) => {
    await meetingsApi.remove(id);
    setMeetings((current) => current.filter((meeting) => meeting.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Meetings</h1>
          <p className="text-muted-foreground">Create meetings and keep their action items connected.</p>
        </div>
        <Button asChild>
          <Link to="/meetings/new">
            <Plus className="h-4 w-4" />
            New meeting
          </Link>
        </Button>
      </div>
      {isLoading ? <p className="text-sm text-muted-foreground">Loading meetings...</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {meetings.map((meeting) => (
          <Card key={meeting.id}>
            <CardHeader>
              <CardTitle>
                <Link className="hover:text-primary" to={`/meetings/${meeting.id}`}>
                  {meeting.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {new Date(meeting.createdAt).toLocaleDateString()} · {meeting._count?.tasks ?? 0} tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="line-clamp-3 text-sm text-muted-foreground">{meeting.notes}</p>
              <Button variant="outline" size="sm" onClick={() => void deleteMeeting(meeting.id)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {!isLoading && meetings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">No meetings yet. Create one to begin.</CardContent>
        </Card>
      ) : null}
    </div>
  );
};
