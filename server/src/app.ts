import cors from "cors";
import express from "express";
import { authRouter } from "./routes/authRoutes.js";
import { dashboardRouter } from "./routes/dashboardRoutes.js";
import { meetingRouter } from "./routes/meetingRoutes.js";
import { taskRouter } from "./routes/taskRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { env } from "./utils/env.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "actionflow-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/meetings", meetingRouter);
app.use("/api/tasks", taskRouter);

app.use(notFoundHandler);
app.use(errorHandler);
