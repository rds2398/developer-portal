import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { SearchCommand } from "@/components/search-command";

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* FIXED SIDEBAR */}
      <aside className="w-64 h-screen shrink-0 border-r overflow-y-auto">
        <Sidebar />
      </aside>
      <SearchCommand/>

      {/* SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>

    </div>
  );
}