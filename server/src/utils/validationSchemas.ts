import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8).max(128)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1)
  })
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

export const createMeetingSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(160),
    notes: z.string().trim().min(1).max(20000)
  })
});

const taskStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "DONE"]);
const dueDateSchema = z.string().datetime({ offset: true });

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200),
    owner: z.string().trim().min(1).max(120),
    dueDate: dueDateSchema,
    status: taskStatusSchema.optional(),
    meetingId: z.string().min(1)
  })
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z
    .object({
      title: z.string().trim().min(1).max(200).optional(),
      owner: z.string().trim().min(1).max(120).optional(),
      dueDate: dueDateSchema.optional(),
      status: taskStatusSchema.optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field must be provided"
    })
});
