import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { MeetingDetailPage } from "@/pages/MeetingDetailPage";
import { MeetingsPage } from "@/pages/MeetingsPage";
import { NewMeetingPage } from "@/pages/NewMeetingPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { TasksPage } from "@/pages/TasksPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/meetings", element: <MeetingsPage /> },
          { path: "/meetings/new", element: <NewMeetingPage /> },
          { path: "/meetings/:id", element: <MeetingDetailPage /> },
          { path: "/tasks", element: <TasksPage /> }
        ]
      }
    ]
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> }
]);
