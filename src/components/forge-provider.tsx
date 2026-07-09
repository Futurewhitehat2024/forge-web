"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getPersistableState, useForgeStore } from "@/lib/store";
import type { ForgeData } from "@/lib/types";
import { cn } from "@/lib/utils";

const SAVE_DEBOUNCE_MS = 800;

export function ForgeProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const hydrated = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/forge");

        if (!res.ok) {
          if (res.status === 503) {
            console.warn("Forge: database unavailable, using local seed state");
            return;
          }
          throw new Error(`Failed to load workspace (${res.status})`);
        }

        const data = (await res.json()) as ForgeData;
        if (!cancelled) {
          useForgeStore.getState().hydrate(data);
        }
      } catch (error) {
        console.error("Forge: failed to hydrate workspace", error);
      } finally {
        if (!cancelled) {
          hydrated.current = true;
          setLoading(false);
        }
      }
    }

    void load();

    const unsubscribe = useForgeStore.subscribe((state, prev) => {
      if (!hydrated.current) return;

      const next = getPersistableState(state);
      const previous = getPersistableState(prev);

      if (JSON.stringify(next) === JSON.stringify(previous)) return;

      if (saveTimer.current) clearTimeout(saveTimer.current);

      saveTimer.current = setTimeout(() => {
        void fetch("/api/forge", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        }).catch((error) => {
          console.error("Forge: failed to persist workspace", error);
        });
      }, SAVE_DEBOUNCE_MS);
    });

    return () => {
      cancelled = true;
      unsubscribe();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <RefreshCw className={cn("h-8 w-8 animate-spin text-primary")} />
          <p className="text-sm">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}