import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";

export function AppLayout() {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}