"use client";

import Link from "next/link";
import {
  DollarSign, TrendingUp, Users, Zap, ArrowRight, Film, FileText, Bot,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { PlatformPie } from "@/components/charts/platform-pie";
import { useForgeStore, getTotalRevenue, getConnectedCount } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const shortcuts = [
  { href: "/video", label: "Video Studio", icon: Film, desc: "Upload & clip" },
  { href: "/content", label: "Content Hub", icon: FileText, desc: "Ideas & schedule" },
  { href: "/coach", label: "AI Coach", icon: Bot, desc: "Weekly game plan" },
];

export default function DashboardPage() {
  const revenueEntries = useForgeStore((s) => s.revenueEntries);
  const connectedPlatforms = useForgeStore((s) => s.connectedPlatforms);
  const notifications = useForgeStore((s) => s.notifications);
  const weeklyGoals = useForgeStore((s) => s.weeklyGoals);
  const calendarEvents = useForgeStore((s) => s.calendarEvents);
  const team = useForgeStore((s) => s.team);

  const totalRevenue = getTotalRevenue(revenueEntries);
  const connected = getConnectedCount(connectedPlatforms);
  const paidRevenue = revenueEntries.filter((e) => e.status === "paid").reduce((s, e) => s + e.amount, 0);

  return (
    <div className="page-enter">
      <PageHeader
        title="Dashboard"
        description="Your creator command center — revenue, content, and growth at a glance."
        actions={
          <Button variant="accent" size="sm" onClick={() => useForgeStore.getState().syncAll()}>
            <Zap className="h-3.5 w-3.5" /> Sync All
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, change: "+18% MoM" },
          { label: "Paid Out", value: formatCurrency(paidRevenue), icon: TrendingUp, change: "This period" },
          { label: "Platforms Linked", value: `${connected}/7`, icon: Zap, change: "Auto-sync on" },
          { label: "Team Members", value: String(team.filter((m) => m.status === "active").length), icon: Users, change: "3 active splits" },
        ].map((kpi) => (
          <Card key={kpi.label} className="glass transition-all hover:border-primary/30">
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{kpi.value}</p>
                <p className="mt-1 text-xs text-emerald-500">{kpi.change}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <kpi.icon className="h-4 w-4 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly gross across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>By Platform</CardTitle>
            <CardDescription>Revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformPie entries={revenueEntries} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest notifications & events</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg border border-border/50 bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
                <Badge variant={n.type === "revenue" ? "success" : n.type === "warning" ? "warning" : "secondary"} className="mt-0.5 shrink-0">
                  {n.type}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
                {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {shortcuts.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-all hover:border-primary/40 hover:bg-secondary/40"
                >
                  <s.icon className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Weekly Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weeklyGoals.map((g) => {
                const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <div key={g.id}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{g.label}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {calendarEvents.slice(0, 3).map((e) => (
                <div key={e.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{e.title}</span>
                  <Badge variant="outline" className="shrink-0 text-[10px]">{e.date.slice(5)}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}