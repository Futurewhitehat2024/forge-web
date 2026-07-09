import type { Platform } from "@/lib/constants";

export type ConnectedPlatform = {
  connected: boolean;
  handle?: string;
  lastSync?: string;
  monthlyRevenue?: number;
};

export type RevenueEntry = {
  id: string;
  platform: Platform | "Sponsorship" | "Merch" | "Other";
  amount: number;
  date: string;
  description: string;
  status: "pending" | "paid" | "processing";
};

export type Idea = {
  id: string;
  title: string;
  platform: Platform;
  notes: string;
  status: "idea" | "in-progress" | "done";
  createdAt: string;
};

export type Draft = {
  id: string;
  title: string;
  platform: Platform;
  content: string;
  scheduledFor?: string;
  status: "draft" | "scheduled" | "published";
  createdAt: string;
};

export type EvergreenItem = {
  id: string;
  title: string;
  platform: Platform;
  url?: string;
  performance: "high" | "medium" | "low";
  lastUpdated: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  splitPercent: number;
  avatar?: string;
  status: "active" | "invited" | "inactive";
};

export type CollabProject = {
  id: string;
  title: string;
  partner: string;
  platform: Platform;
  status: "planning" | "active" | "completed";
  revenue: number;
  dueDate: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  platform: Platform;
  date: string;
  type: "publish" | "stream" | "collab" | "meeting";
};

export type Asset = {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "template" | "other";
  size: string;
  uploadedAt: string;
  tags: string[];
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "revenue";
  read: boolean;
  createdAt: string;
};

export type Settings = {
  studioName: string;
  workspace: string;
  email: string;
  timezone: string;
  autoSync: boolean;
  syncInterval: number;
  emailAlerts: boolean;
  revenueAlerts: boolean;
  darkMode: boolean;
};

export type WeeklyGoal = {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
};

export type SplitConfig = {
  members: { id: string; name: string; percent: number }[];
  totalRevenue: number;
  period: string;
};

export type SourceVideo = {
  id: string;
  name: string;
  duration: string;
  size: string;
  uploadedAt: string;
  status: "ready" | "processing" | "uploading";
};

export type GeneratedClip = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: string;
  thumbnail?: string;
  status: "ready" | "editing" | "published";
};

export type UploadQueueItem = {
  id: string;
  name: string;
  platform: Platform;
  progress: number;
  status: "queued" | "uploading" | "complete" | "failed";
};

export type SyncLogEntry = {
  id: string;
  platform: Platform;
  status: "success" | "error" | "syncing";
  message: string;
  timestamp: string;
};

/** Persistable workspace state (no actions or transient UI flags). */
export type ForgeData = {
  connectedPlatforms: Record<Platform, ConnectedPlatform>;
  revenueEntries: RevenueEntry[];
  ideas: Idea[];
  drafts: Draft[];
  evergreen: EvergreenItem[];
  team: TeamMember[];
  collabProjects: CollabProject[];
  calendarEvents: CalendarEvent[];
  assets: Asset[];
  notifications: Notification[];
  settings: Settings;
  weeklyGoals: WeeklyGoal[];
  splitConfig: SplitConfig;
  generatedContract: string;
  sourceVideo: SourceVideo | null;
  generatedClips: GeneratedClip[];
  uploadQueue: UploadQueueItem[];
  syncLog: SyncLogEntry[];
};

export type Workspace = {
  id: string;
  clerk_user_id: string;
  state: ForgeData;
  updated_at: string;
};