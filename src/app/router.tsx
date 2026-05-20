import { createBrowserRouter } from "react-router-dom";

import { Login } from "@/pages/login";
import { Signup } from "@/pages/signup";
import { Dashboard } from "@/pages/dashboard";
import { ProtectedRoute } from "@/route/protected-route";
import { AppLayout } from "@/layout/app-layout";
import { ApiDocs } from "@/pages/api-docs";
import { Sandbox } from "@/pages/sandbox";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  // 🔥 ALL PROTECTED APP ROUTES UNDER ONE LAYOUT
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "sandbox",
        element: <Sandbox />,
      },
      {
        path: "api/:apiId",
        element: <ApiDocs />,
      },
    ],
  },
]);