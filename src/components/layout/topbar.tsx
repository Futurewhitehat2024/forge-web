"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { NAV } from "@/lib/constants";
import { useForgeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const settings = useForgeStore((s) => s.settings);
  const isSyncing = useForgeStore((s) => s.isSyncing);
  const syncAll = useForgeStore((s) => s.syncAll);
  const unreadCount = useForgeStore((s) => s.notifications.filter((n) => !n.read).length);

  const current = NAV.find((n) => n.href === pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
          {settings.workspace}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
        <span className="font-medium">{current?.label ?? "Forge"}</span>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="hidden sm:flex font-normal">
          {settings.studioName}
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => syncAll()}
          disabled={isSyncing}
          className="gap-1.5 text-muted-foreground"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
          <span className="hidden sm:inline">{isSyncing ? "Syncing…" : "Sync"}</span>
        </Button>

        {unreadCount > 0 && (
          <Badge variant="warning" className="h-5 min-w-5 justify-center px-1.5">
            {unreadCount}
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isLoaded && isSignedIn && (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        )}
        {isLoaded && !isSignedIn && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        )}
      </div>
    </header>
  );
}