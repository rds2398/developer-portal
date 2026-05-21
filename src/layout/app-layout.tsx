import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { SearchCommand } from "@/components/search-command";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <div className="h-dvh min-h-screen bg-background overflow-hidden flex flex-col">
      <Header onMenuClick={() => setMobileNavOpen(true)} />
      <SearchCommand />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {mobileNavOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[min(100%,18rem)] border-r border-border bg-sidebar shadow-lg transition-transform duration-200 ease-out md:hidden",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-hidden={!mobileNavOpen}
        >
          <Sidebar onNavigate={() => setMobileNavOpen(false)} />
        </aside>

        <aside className="hidden md:block w-64 shrink-0 border-r border-border overflow-y-auto">
          <Sidebar />
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
