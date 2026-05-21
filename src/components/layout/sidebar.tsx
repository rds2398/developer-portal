import { NavLink } from "react-router-dom";
import { API_REGISTRY } from "@/api/api-registry";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  LayoutDashboard,
  FlaskConical,
  KeyRound,
  ScrollText,
  Activity,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Log out successfully");
    navigate("/login");
  }

  return (
    <div className="w-64 border-r p-4">
      <h2 className="font-bold mb-4">Developer Portal</h2>

      <div className="space-y-2 mb-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded ${
              isActive ? "bg-gray-600 text-white" : "hover:bg-gray-600"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/sandbox"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded ${
              isActive ? "bg-gray-600 text-white" : "hover:bg-gray-600"
            }`
          }
        >
          <FlaskConical size={18} />
          Sandbox
        </NavLink>

        <NavLink
          to="/api-keys"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded ${
              isActive ? "bg-gray-600 text-white" : "hover:bg-gray-600"
            }`
          }
        >
          <KeyRound size={18} />
          API Keys
        </NavLink>

        <NavLink
          to="/changeLog"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded ${
              isActive ? "bg-gray-600 text-white" : "hover:bg-gray-600"
            }`
          }
        >
          <ScrollText size={18} />
          Change Logs
        </NavLink>

        <NavLink
          to="/status"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded ${
              isActive ? "bg-gray-600 text-white" : "hover:bg-gray-600"
            }`
          }
        >
          <Activity size={18} />
          API Status
        </NavLink>
      </div>

      <div className="mt-4 text-xs text-gray-500">APIs</div>

      <div className="space-y-2 mt-2">
        {API_REGISTRY.map((api) => (
          <NavLink
            key={api.id}
            to={`/api/${api.id}`}
            className={({ isActive }) =>
              `block p-2 rounded ${
                isActive ? "bg-gray-600 text-white" : "hover:bg-gray-600"
              }`
            }
          >
            {api.name}
          </NavLink>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full p-2 rounded bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
