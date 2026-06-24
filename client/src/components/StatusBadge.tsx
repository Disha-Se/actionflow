import type { TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const labels: Record<TaskStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  DONE: "Done"
};

const styles: Record<TaskStatus, string> = {
  OPEN: "border-amber-200 bg-amber-50 text-amber-800",
  IN_PROGRESS: "border-cyan-200 bg-cyan-50 text-cyan-800",
  DONE: "border-emerald-200 bg-emerald-50 text-emerald-800"
};

export const StatusBadge = ({ status }: { status: TaskStatus }) => (
  <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", styles[status])}>
    {labels[status]}
  </span>
);
