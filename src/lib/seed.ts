import { PLATFORMS, type Platform } from "@/lib/constants";
import type {
  ConnectedPlatform,
  ForgeData,
  RevenueEntry,
  TeamMember,
} from "@/lib/types";

const defaultPlatforms = (): Record<Platform, ConnectedPlatform> =>
  Object.fromEntries(PLATFORMS.map((p) => [p, { connected: false }])) as Record<
    Platform,
    ConnectedPlatform
  >;

const seedRevenue: RevenueEntry[] = [
  { id: "r1", platform: "YouTube", amount: 4200, date: "2026-07-01", description: "AdSense July", status: "paid" },
  { id: "r2", platform: "Twitch", amount: 1850, date: "2026-07-03", description: "Subs + Bits", status: "paid" },
  { id: "r3", platform: "Sponsorship", amount: 5000, date: "2026-07-05", description: "Brand deal — TechCo", status: "processing" },
  { id: "r4", platform: "TikTok", amount: 920, date: "2026-06-28", description: "Creator Fund", status: "paid" },
  { id: "r5", platform: "Patreon", amount: 1340, date: "2026-07-02", description: "Monthly pledges", status: "paid" },
];

const seedTeam: TeamMember[] = [
  { id: "t1", name: "You", role: "Creator / Owner", email: "you@forge.studio", splitPercent: 60, status: "active" },
  { id: "t2", name: "Alex Rivera", role: "Editor", email: "alex@forge.studio", splitPercent: 20, status: "active" },
  { id: "t3", name: "Sam Chen", role: "Thumbnail Designer", email: "sam@forge.studio", splitPercent: 10, status: "active" },
  { id: "t4", name: "Jordan Lee", role: "Community Manager", email: "jordan@forge.studio", splitPercent: 10, status: "invited" },
];

export function createSeedState(): ForgeData {
  return {
    connectedPlatforms: {
      ...defaultPlatforms(),
      YouTube: { connected: true, handle: "@forgecreator", lastSync: new Date().toISOString(), monthlyRevenue: 4200 },
      Twitch: { connected: true, handle: "forgecreator", lastSync: new Date().toISOString(), monthlyRevenue: 1850 },
      TikTok: { connected: true, handle: "@forgecreator", lastSync: new Date().toISOString(), monthlyRevenue: 920 },
    },
    revenueEntries: seedRevenue,
    ideas: [
      { id: "i1", title: "10 Editing Mistakes Beginners Make", platform: "YouTube", notes: "Tutorial format, 12 min", status: "in-progress", createdAt: "2026-07-01" },
      { id: "i2", title: "Day in the Life — Creator Edition", platform: "TikTok", notes: "Fast cuts, trending audio", status: "idea", createdAt: "2026-07-03" },
      { id: "i3", title: "React to Viral Clips", platform: "Twitch", notes: "2-hour stream segment", status: "idea", createdAt: "2026-07-05" },
    ],
    drafts: [
      { id: "d1", title: "Q3 Channel Update", platform: "YouTube", content: "Hey everyone, big news coming...", status: "draft", createdAt: "2026-07-04" },
      { id: "d2", title: "New Setup Tour", platform: "Instagram", content: "Behind the scenes of the studio rebuild", status: "scheduled", scheduledFor: "2026-07-12", createdAt: "2026-07-02" },
    ],
    evergreen: [
      { id: "e1", title: "How I Grew to 100K Subs", platform: "YouTube", url: "https://youtube.com/watch?v=example", performance: "high", lastUpdated: "2026-06-15" },
      { id: "e2", title: "Best Mic Under $100", platform: "TikTok", performance: "medium", lastUpdated: "2026-05-20" },
    ],
    team: seedTeam,
    collabProjects: [
      { id: "c1", title: "Creator Summit Collab", partner: "Nova Studios", platform: "YouTube", status: "active", revenue: 2500, dueDate: "2026-07-20" },
      { id: "c2", title: "Gaming Marathon", partner: "PixelPlay", platform: "Twitch", status: "planning", revenue: 0, dueDate: "2026-08-01" },
    ],
    calendarEvents: [
      { id: "ev1", title: "Publish: Q3 Update", platform: "YouTube", date: "2026-07-10", type: "publish" },
      { id: "ev2", title: "Stream: Friday Night", platform: "Twitch", date: "2026-07-11", type: "stream" },
      { id: "ev3", title: "Collab Recording", platform: "YouTube", date: "2026-07-15", type: "collab" },
    ],
    assets: [
      { id: "a1", name: "Channel Banner 2026.png", type: "image", size: "2.4 MB", uploadedAt: "2026-06-01", tags: ["branding"] },
      { id: "a2", name: "Intro Animation.mp4", type: "video", size: "18 MB", uploadedAt: "2026-05-15", tags: ["intro", "video"] },
      { id: "a3", name: "Podcast Intro.wav", type: "audio", size: "4.1 MB", uploadedAt: "2026-04-20", tags: ["audio"] },
    ],
    notifications: [
      { id: "n1", title: "Revenue synced", message: "YouTube AdSense updated — $4,200", type: "revenue", read: false, createdAt: new Date().toISOString() },
      { id: "n2", title: "New collab invite", message: "Nova Studios wants to collaborate", type: "info", read: false, createdAt: new Date().toISOString() },
    ],
    settings: {
      studioName: "Forge Studio",
      workspace: "Main Workspace",
      email: "hello@forge.studio",
      timezone: "America/New_York",
      autoSync: true,
      syncInterval: 60,
      emailAlerts: true,
      revenueAlerts: true,
      darkMode: true,
    },
    weeklyGoals: [
      { id: "g1", label: "Videos published", target: 3, current: 1, unit: "videos" },
      { id: "g2", label: "Stream hours", target: 12, current: 5, unit: "hours" },
      { id: "g3", label: "Revenue target", target: 8000, current: 5200, unit: "$" },
      { id: "g4", label: "New subscribers", target: 500, current: 312, unit: "subs" },
    ],
    splitConfig: {
      members: seedTeam.filter((m) => m.status === "active").map((m) => ({ id: m.id, name: m.name, percent: m.splitPercent })),
      totalRevenue: 13310,
      period: "July 2026",
    },
    generatedContract: "",
    sourceVideo: null,
    generatedClips: [],
    uploadQueue: [],
    syncLog: [],
  };
}