import { NavLink } from "react-router-dom";
import { API_REGISTRY } from "@/api/api-registry";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
            `block p-2 rounded ${
              isActive ? "bg-gray-600 text-white" : "hover:bg-gray-600"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/sandbox"
          className={({ isActive }) =>
            `block p-2 rounded ${
              isActive ? "bg-gray-600 text-white" : "hover:bg-gray-600"
            }`
          }
        >
          Sandbox
        </NavLink>
        <NavLink
          to="/api-keys"
          className={({ isActive }) =>
            `block p-2 rounded ${
              isActive ? "bg-gray-600 text-white" : "hover:bg-gray-600"
            }`
          }
        >
          API Keys
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
        className="mt-6 w-full p-2 rounded bg-red-500 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
