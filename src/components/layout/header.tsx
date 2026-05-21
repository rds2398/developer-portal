import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  onMenuClick?: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {onMenuClick && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9 shrink-0 md:hidden"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
            >
              <Menu className="size-4" />
            </Button>
          )}

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold truncate text-foreground">
              <span className="sm:hidden">Developer Portal</span>
              <span className="hidden sm:inline">Welcome to Developer Portal</span>
            </h1>

            <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground truncate">
              Manage APIs, sandbox requests, analytics and documentation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="hidden sm:flex px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-medium whitespace-nowrap">
            System Operational
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
