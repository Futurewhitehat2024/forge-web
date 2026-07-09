"use client";

import { create } from "zustand";
import { PLATFORMS, type Platform } from "@/lib/constants";
import { generateSplitContract } from "@/lib/contracts";
import { createSeedState } from "@/lib/seed";
import type {
  Asset,
  CalendarEvent,
  CollabProject,
  ConnectedPlatform,
  Draft,
  EvergreenItem,
  ForgeData,
  GeneratedClip,
  Idea,
  Notification,
  RevenueEntry,
  Settings,
  SourceVideo,
  SplitConfig,
  SyncLogEntry,
  TeamMember,
  UploadQueueItem,
  WeeklyGoal,
} from "@/lib/types";

export type {
  Asset,
  CalendarEvent,
  CollabProject,
  ConnectedPlatform,
  Draft,
  EvergreenItem,
  ForgeData,
  GeneratedClip,
  Idea,
  Notification,
  RevenueEntry,
  Settings,
  SourceVideo,
  SplitConfig,
  SyncLogEntry,
  TeamMember,
  UploadQueueItem,
  WeeklyGoal,
} from "@/lib/types";

type ForgeState = ForgeData & {
  isSyncing: boolean;

  hydrate: (data: Partial<ForgeData>) => void;
  connectPlatform: (platform: Platform, handle?: string) => void;
  disconnectPlatform: (platform: Platform) => void;
  syncAll: () => Promise<void>;
  addRevenueEntry: (entry: Omit<RevenueEntry, "id">) => void;
  calculateSplits: () => void;
  generateContract: () => void;
  addIdea: (idea: Omit<Idea, "id" | "createdAt">) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  addDraft: (draft: Omit<Draft, "id" | "createdAt">) => void;
  updateDraft: (id: string, updates: Partial<Draft>) => void;
  deleteDraft: (id: string) => void;
  addEvergreen: (item: Omit<EvergreenItem, "id">) => void;
  addTeamMember: (member: Omit<TeamMember, "id">) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (id: string) => void;
  addCollabProject: (project: Omit<CollabProject, "id">) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;
  deleteCalendarEvent: (id: string) => void;
  addAsset: (asset: Omit<Asset, "id" | "uploadedAt">) => void;
  deleteAsset: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
  updateWeeklyGoal: (id: string, current: number) => void;
  setSplitConfig: (config: Partial<SplitConfig>) => void;
  setSourceVideo: (video: SourceVideo | null) => void;
  generateClips: () => void;
  updateClip: (id: string, updates: Partial<GeneratedClip>) => void;
  addToUploadQueue: (item: Omit<UploadQueueItem, "id">) => void;
  updateUploadProgress: (id: string, progress: number, status?: UploadQueueItem["status"]) => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
};

const uid = () => Math.random().toString(36).slice(2, 11);

const seed = createSeedState();

export function getPersistableState(state: ForgeState): ForgeData {
  return {
    connectedPlatforms: state.connectedPlatforms,
    revenueEntries: state.revenueEntries,
    ideas: state.ideas,
    drafts: state.drafts,
    evergreen: state.evergreen,
    team: state.team,
    collabProjects: state.collabProjects,
    calendarEvents: state.calendarEvents,
    assets: state.assets,
    notifications: state.notifications,
    settings: state.settings,
    weeklyGoals: state.weeklyGoals,
    splitConfig: state.splitConfig,
    generatedContract: state.generatedContract,
    sourceVideo: state.sourceVideo,
    generatedClips: state.generatedClips,
    uploadQueue: state.uploadQueue,
    syncLog: state.syncLog,
  };
}

export const useForgeStore = create<ForgeState>()((set, get) => ({
  ...seed,
  isSyncing: false,

  hydrate: (data) => {
    set((state) => ({ ...state, ...data }));
  },

  connectPlatform: (platform, handle) => {
    set((s) => ({
      connectedPlatforms: {
        ...s.connectedPlatforms,
        [platform]: {
          connected: true,
          handle,
          lastSync: new Date().toISOString(),
          monthlyRevenue: Math.floor(Math.random() * 3000) + 500,
        },
      },
    }));
    get().addNotification({
      title: `${platform} connected`,
      message: `Successfully linked ${handle || platform}`,
      type: "success",
    });
  },

  disconnectPlatform: (platform) => {
    set((s) => ({
      connectedPlatforms: { ...s.connectedPlatforms, [platform]: { connected: false } },
    }));
  },

  syncAll: async () => {
    set({ isSyncing: true });
    const connected = PLATFORMS.filter((p) => get().connectedPlatforms[p].connected);
    const logs: SyncLogEntry[] = connected.map((platform) => ({
      id: uid(),
      platform,
      status: "syncing" as const,
      message: `Syncing ${platform}...`,
      timestamp: new Date().toISOString(),
    }));
    set({ syncLog: [...logs, ...get().syncLog].slice(0, 50) });

    await new Promise((r) => setTimeout(r, 1500));

    const updated = { ...get().connectedPlatforms };
    connected.forEach((platform) => {
      updated[platform] = { ...updated[platform], lastSync: new Date().toISOString() };
    });

    const successLogs: SyncLogEntry[] = connected.map((platform) => ({
      id: uid(),
      platform,
      status: "success" as const,
      message: `${platform} synced successfully`,
      timestamp: new Date().toISOString(),
    }));

    set({
      connectedPlatforms: updated,
      isSyncing: false,
      syncLog: [...successLogs, ...get().syncLog].slice(0, 50),
    });
    get().addNotification({
      title: "Sync complete",
      message: `${connected.length} platforms updated`,
      type: "success",
    });
  },

  addRevenueEntry: (entry) => {
    set((s) => ({ revenueEntries: [{ ...entry, id: uid() }, ...s.revenueEntries] }));
  },

  calculateSplits: () => {
    const { team, revenueEntries } = get();
    const total = revenueEntries.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.amount, 0);
    set({
      splitConfig: {
        members: team.filter((m) => m.status === "active").map((m) => ({ id: m.id, name: m.name, percent: m.splitPercent })),
        totalRevenue: total,
        period: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      },
    });
  },

  generateContract: () => {
    const { splitConfig, settings } = get();
    const contract = generateSplitContract({
      studioName: settings.studioName,
      period: splitConfig.period,
      totalRevenue: splitConfig.totalRevenue,
      members: splitConfig.members,
    });
    set({ generatedContract: contract });
  },

  addIdea: (idea) => {
    set((s) => ({
      ideas: [{ ...idea, id: uid(), createdAt: new Date().toISOString().split("T")[0] }, ...s.ideas],
    }));
  },

  updateIdea: (id, updates) => {
    set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...updates } : i)) }));
  },

  deleteIdea: (id) => {
    set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) }));
  },

  addDraft: (draft) => {
    set((s) => ({
      drafts: [{ ...draft, id: uid(), createdAt: new Date().toISOString().split("T")[0] }, ...s.drafts],
    }));
  },

  updateDraft: (id, updates) => {
    set((s) => ({ drafts: s.drafts.map((d) => (d.id === id ? { ...d, ...updates } : d)) }));
  },

  deleteDraft: (id) => {
    set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) }));
  },

  addEvergreen: (item) => {
    set((s) => ({ evergreen: [{ ...item, id: uid() }, ...s.evergreen] }));
  },

  addTeamMember: (member) => {
    set((s) => ({ team: [...s.team, { ...member, id: uid() }] }));
  },

  updateTeamMember: (id, updates) => {
    set((s) => ({ team: s.team.map((m) => (m.id === id ? { ...m, ...updates } : m)) }));
  },

  removeTeamMember: (id) => {
    set((s) => ({ team: s.team.filter((m) => m.id !== id) }));
  },

  addCollabProject: (project) => {
    set((s) => ({ collabProjects: [{ ...project, id: uid() }, ...s.collabProjects] }));
  },

  addCalendarEvent: (event) => {
    set((s) => ({ calendarEvents: [...s.calendarEvents, { ...event, id: uid() }] }));
  },

  deleteCalendarEvent: (id) => {
    set((s) => ({ calendarEvents: s.calendarEvents.filter((e) => e.id !== id) }));
  },

  addAsset: (asset) => {
    set((s) => ({
      assets: [{ ...asset, id: uid(), uploadedAt: new Date().toISOString().split("T")[0] }, ...s.assets],
    }));
  },

  deleteAsset: (id) => {
    set((s) => ({ assets: s.assets.filter((a) => a.id !== id) }));
  },

  markNotificationRead: (id) => {
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
  },

  clearNotifications: () => {
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  },

  updateSettings: (updates) => {
    set((s) => ({ settings: { ...s.settings, ...updates } }));
  },

  updateWeeklyGoal: (id, current) => {
    set((s) => ({ weeklyGoals: s.weeklyGoals.map((g) => (g.id === id ? { ...g, current } : g)) }));
  },

  setSplitConfig: (config) => {
    set((s) => ({ splitConfig: { ...s.splitConfig, ...config } }));
  },

  setSourceVideo: (video) => {
    set({ sourceVideo: video });
  },

  generateClips: () => {
    const clips: GeneratedClip[] = Array.from({ length: 20 }, (_, i) => ({
      id: uid(),
      title: `Clip ${i + 1}: Highlight Moment`,
      startTime: `${Math.floor(i * 2.5)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      endTime: `${Math.floor(i * 2.5 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      duration: "0:45",
      status: "ready" as const,
    }));
    set({ generatedClips: clips });
    get().addNotification({
      title: "Clips generated",
      message: "20 auto-clips ready for review",
      type: "success",
    });
  },

  updateClip: (id, updates) => {
    set((s) => ({ generatedClips: s.generatedClips.map((c) => (c.id === id ? { ...c, ...updates } : c)) }));
  },

  addToUploadQueue: (item) => {
    set((s) => ({ uploadQueue: [...s.uploadQueue, { ...item, id: uid() }] }));
  },

  updateUploadProgress: (id, progress, status) => {
    set((s) => ({
      uploadQueue: s.uploadQueue.map((u) =>
        u.id === id ? { ...u, progress, ...(status ? { status } : {}) } : u
      ),
    }));
  },

  addNotification: (notification) => {
    set((s) => ({
      notifications: [
        { ...notification, id: uid(), read: false, createdAt: new Date().toISOString() },
        ...s.notifications,
      ].slice(0, 30),
    }));
  },
}));

export function getTotalRevenue(entries: RevenueEntry[]) {
  return entries.reduce((sum, e) => sum + e.amount, 0);
}

export function getConnectedCount(platforms: Record<Platform, ConnectedPlatform>) {
  return Object.values(platforms).filter((p) => p.connected).length;
}