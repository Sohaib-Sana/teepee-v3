import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import AuthPage from "./Pages/AuthPage";
import LoginForm from "./components/AuthComponents/LoginForm";
import SignupForm from "./components/AuthComponents/SignupForm";

function App() {
  function ProtectedRoute({ children, isAuthenticated }) {
    return isAuthenticated ? children : <Navigate to="/auth" />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthPage />,
      children: [
        { path: "login", element: <LoginForm /> },
        { path: "register", element: <SignupForm /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
