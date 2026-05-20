import {  NavLink } from "react-router-dom";
import { API_REGISTRY } from "@/api/api-registry";

export function Sidebar() {
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
    </div>
  );
}
