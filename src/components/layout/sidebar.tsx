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
    block
      ? "block p-2.5 rounded-lg transition-colors text-sm sm:text-base"
      : "flex items-center gap-2 p-2.5 rounded-lg transition-colors text-sm sm:text-base",
    isActive
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
  );
}

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Log out successfully");
    onNavigate?.();
    navigate("/login");
  }

  return (
    <div className="flex h-full flex-col w-full p-3 sm:p-4 bg-sidebar text-sidebar-foreground overflow-y-auto">
      <h2 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base shrink-0">
        Developer Portal
      </h2>

      <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
        <NavLink
          to="/"
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <LayoutDashboard size={18} className="shrink-0" />
          Dashboard
        </NavLink>

        <NavLink
          to="/sandbox"
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <FlaskConical size={18} className="shrink-0" />
          Sandbox
        </NavLink>

        <NavLink
          to="/api-keys"
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <KeyRound size={18} className="shrink-0" />
          API Keys
        </NavLink>

        <NavLink
          to="/changelog"
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <ScrollText size={18} className="shrink-0" />
          Change Logs
        </NavLink>

        <NavLink
          to="/status"
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <Activity size={18} className="shrink-0" />
          API Status
        </NavLink>
      </div>

      <div className="mt-2 sm:mt-4 text-xs text-muted-foreground shrink-0">APIs</div>

      <div className="space-y-1 sm:space-y-2 mt-1 sm:mt-2 flex-1 min-h-0 overflow-y-auto">
        {API_REGISTRY.map((api) => (
          <NavLink
            key={api.id}
            to={`/api/${api.id}`}
            onClick={onNavigate}
            className={({ isActive }) => navLinkClass(isActive, true)}
          >
            {api.name}
          </NavLink>
        ))}
      </div>

      <Button
        variant="destructive"
        className="mt-4 sm:mt-6 w-full cursor-pointer shrink-0"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        Logout
      </Button>
    </div>
  );
}
