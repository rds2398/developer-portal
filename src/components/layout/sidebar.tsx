import { NavLink } from "react-router-dom";
import { API_REGISTRY } from "@/api/api-registry";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  FlaskConical,
  KeyRound,
  ScrollText,
  Activity,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";

function navLinkClass(isActive: boolean, block = false) {
  return cn(
    block ? "block p-2 rounded transition-colors" : "flex items-center gap-2 p-2 rounded transition-colors",
    isActive
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
  );
}

export function Sidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Log out successfully");
    navigate("/login");
  }

  return (
    <div className="w-64 border-r border-border p-4 bg-sidebar text-sidebar-foreground">
      <h2 className="font-bold mb-4">Developer Portal</h2>

      <div className="space-y-2 mb-4">
        <NavLink
          to="/"
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/sandbox"
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <FlaskConical size={18} />
          Sandbox
        </NavLink>

        <NavLink
          to="/api-keys"
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <KeyRound size={18} />
          API Keys
        </NavLink>

        <NavLink
          to="/changeLog"
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <ScrollText size={18} />
          Change Logs
        </NavLink>

        <NavLink
          to="/status"
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <Activity size={18} />
          API Status
        </NavLink>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">APIs</div>

      <div className="space-y-2 mt-2">
        {API_REGISTRY.map((api) => (
          <NavLink
            key={api.id}
            to={`/api/${api.id}`}
            className={({ isActive }) => navLinkClass(isActive, true)}
          >
            {api.name}
          </NavLink>
        ))}
      </div>

      <Button
        variant="destructive"
        className="mt-6 w-full cursor-pointer"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        Logout
      </Button>
    </div>
  );
}
