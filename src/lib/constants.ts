import {
  LayoutDashboard, FileText, Users, DollarSign, BookOpen,
  Lightbulb, FolderOpen, Bot, Settings, Film, type LucideIcon,
} from "lucide-react";

export const PLATFORMS = ["YouTube", "TikTok", "Twitch", "Kick", "X", "Instagram", "Patreon"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "#FF0000", TikTok: "#010101", Twitch: "#9146FF", Kick: "#53FC18",
  X: "#14171A", Instagram: "#E1306C", Patreon: "#FF424D",
};

export type NavItem = { href: string; label: string; icon: LucideIcon; group: string };

export const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/content", label: "Content Hub", icon: FileText, group: "Create" },
  { href: "/video", label: "Video Studio", icon: Film, group: "Create" },
  { href: "/assets", label: "Asset Library", icon: FolderOpen, group: "Create" },
  { href: "/revenue", label: "Revenue & Payouts", icon: DollarSign, group: "Money" },
  { href: "/finance", label: "Financial Literacy", icon: BookOpen, group: "Money" },
  { href: "/advice", label: "Content Advice", icon: Lightbulb, group: "Grow" },
  { href: "/coach", label: "AI Coach", icon: Bot, group: "Grow" },
  { href: "/team", label: "Team & Collabs", icon: Users, group: "Team" },
  { href: "/settings", label: "Settings", icon: Settings, group: "System" },
];

export const LESSONS: Record<string, string> = {
  "Creator Taxes": "Set aside 25–35% of gross income for taxes. Track every business expense to lower taxable income.",
  Budgeting: "50% living, 30% reinvestment, 20% savings/taxes. Build a 3-month emergency fund first.",
  "Pricing Offers": "Price sponsorships using CPM × views plus brand-fit premium. Bundle deliverables.",
  "Saving & Investing": "Automate savings. After 6 months of expenses, open a SEP-IRA or Solo 401(k).",
  "Business Basics": "Register an LLC, open a business bank account, use contracts, invoice weekly.",
};

export const PLATFORM_TIPS: Record<string, string[]> = {
  YouTube: ["Front-load hooks in 30 seconds.", "Publish consistently.", "Use Chapters and end screens.", "Repurpose into Shorts."],
  TikTok: ["Hook in 1–2 seconds.", "Ride trends with unique angles.", "Post 1–3× daily.", "Reply with video responses."],
  Twitch: ["Stream at consistent times.", "Clear panels and overlays.", "Raid creators in your niche.", "Clip for Shorts."],
  Kick: ["Niche community events.", "Cross-promote on X.", "Sub-only VOD perks.", "Collaborate with mid-size streamers."],
  X: ["Value in tweet one.", "Engage on larger accounts.", "Share BTS content.", "Pin best post weekly."],
  Instagram: ["Reels for reach.", "Consistent visual palette.", "Stories daily.", "Collab Reels."],
};