import { createBrowserRouter } from "react-router-dom";

import { Dashboard } from "@/pages/dashboard";
import { Login } from "@/pages/login";
import { ProtectedRoute } from "@/route/protected-route";
import { Signup } from "@/pages/signup";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);
