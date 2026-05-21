import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate text-foreground">
            Welcome to Developer Portal
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            Manage APIs, sandbox requests, analytics and documentation
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            System Operational
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
