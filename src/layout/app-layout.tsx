import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { SearchCommand } from "@/components/search-command";
import { Header } from "@/components/layout/header";

export function AppLayout() {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* HEADER */}
      <Header />

      {/* SEARCH */}
      <SearchCommand />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 shrink-0 border-r overflow-y-auto  md:block">
          <Sidebar />
        </aside>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
