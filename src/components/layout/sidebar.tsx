"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import { NAV, PLATFORMS } from "@/lib/constants";
import { useForgeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  const pathname = usePathname();
  const connectedPlatforms = useForgeStore((s) => s.connectedPlatforms);

  const groups = NAV.reduce<Record<string, typeof NAV>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
          <Flame className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">Forge</p>
          <p className="text-[10px] text-muted-foreground">Creator OS</p>
        </div>
      </div>

      <Separator className="opacity-60" />

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">{group}</p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all",
                          active
                            ? "bg-secondary text-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                        <span className="truncate">{item.label}</span>
                        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-border/60 p-4">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">Platforms</p>
        <div className="flex flex-wrap gap-1.5">
          {PLATFORMS.map((platform) => {
            const connected = connectedPlatforms[platform]?.connected;
            return (
              <div
                key={platform}
                title={`${platform}${connected ? " — connected" : ""}`}
                className="flex items-center gap-1 rounded-md border border-border/50 bg-secondary/40 px-1.5 py-0.5"
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", connected ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" : "bg-muted-foreground/30")}
                />
                <span className="text-[10px] text-muted-foreground">{platform.slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}