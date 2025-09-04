import { createBrowserRouter, redirect } from "react-router-dom";
import AuthLayout from "../Layouts/authLayout";
import getToken from "../utils/token_helper";
import AppLayout from "../Layouts/AppLayout";
import Dashboard from "../Pages/Dashboard";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import ForgotPage from "../Pages/ForgotPage";
import PapersPage from "../Pages/PapersPage";
import GeneratePaperPage from "../Pages/GeneratePaperPage";
import { api } from "../utils/api";
import QuizPage from "../Pages/QuizPage";

// Protect app (Dashboard)
async function appGuardLoader() {
  const token = getToken();
  if (!token) {
    throw redirect("/login");
  }
  return null;
}

// Prevent seeing auth pages when already logged in
async function authGuardLoader() {
  const token = getToken();
  if (token) {
    throw redirect("/");
  }
  return null;
}

// Load Papers before navigating to PaperSetup
async function PapersLoader() {
  const state = localStorage.getItem("persist:auth");
  const parsedState = JSON.parse(state);
  const user = JSON.parse(parsedState.user);

  const subjectId = user?.subjectId;
  const response = await api.post("/get_papers", { subject_id: subjectId }).catch((error) => console.error("Error getting papers:", error));
  return response;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    loader: appGuardLoader,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/papers", element: <PapersPage /> },
      {
        path: "/task-setup",
        element: <GeneratePaperPage />,
        loader: PapersLoader,
      },
    ],
  },
  { path: "/quiz/:quizId", element: <QuizPage /> },
  {
    element: <AuthLayout />,
    loader: authGuardLoader,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot_password", element: <ForgotPage /> },
    ],
  },
]);
