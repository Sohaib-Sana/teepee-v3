import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import "./App.css";
import AuthLayout from "./Layouts/authLayout";
import getToken from "./utils/token_helper";
import AppLayout from "./Layouts/AppLayout";
import Dashboard from "./Pages/Dashboard";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ForgotPage from "./Pages/ForgotPage";

function App() {
  console.log("Env: ", import.meta.env);

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      loader: appGuardLoader,
      children: [{ index: true, element: <Dashboard /> }],
    },
    {
      element: <AuthLayout />,
      children: [
        { path: "/login", element: <LoginPage />, loader: authGuardLoader },
        { path: "/register", element: <RegisterPage />, loader: authGuardLoader },
        { path: "/forgot_password", element: <ForgotPage />, loader: authGuardLoader },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
