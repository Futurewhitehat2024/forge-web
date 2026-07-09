"use client";

import { Target, Bot, TrendingUp, Zap } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useForgeStore } from "@/lib/store";
import { formatCurrency, formatNumber } from "@/lib/utils";

const GROK_INSIGHTS = [
  { title: "Posting cadence", insight: "You're 2 videos behind your weekly target. Batch-record this weekend to catch up.", priority: "high" },
  { title: "Revenue opportunity", insight: "Twitch subs are up 12% — consider a sub goal overlay for Friday's stream.", priority: "medium" },
  { title: "Content gap", insight: "No TikTok posts in 4 days. Repurpose your latest YouTube clip.", priority: "high" },
  { title: "Team sync", insight: "Alex has 3 drafts pending review. Unblock editor workflow to stay on schedule.", priority: "low" },
];

export default function CoachPage() {
  const weeklyGoals = useForgeStore((s) => s.weeklyGoals);
  const revenueEntries = useForgeStore((s) => s.revenueEntries);
  const ideas = useForgeStore((s) => s.ideas);
  const updateWeeklyGoal = useForgeStore((s) => s.updateWeeklyGoal);

  const totalRevenue = revenueEntries.reduce((s, e) => s + e.amount, 0);
  const pendingIdeas = ideas.filter((i) => i.status === "idea").length;

  return (
    <div className="page-enter">
      <PageHeader
        title="AI Coach"
        description="Your personalized game plan — weekly targets, Grok insights, and growth momentum."
        actions={
          <Button variant="accent" size="sm">
            <Bot className="h-3.5 w-3.5" /> Refresh Insights
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Revenue MTD", value: formatCurrency(totalRevenue), icon: TrendingUp },
          { label: "Ideas in Queue", value: String(pendingIdeas), icon: Zap },
          { label: "Goals on Track", value: `${weeklyGoals.filter((g) => g.current / g.target >= 0.5).length}/${weeklyGoals.length}`, icon: Target },
        ].map((stat) => (
          <Card key={stat.label} className="glass">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" /> Weekly Game Plan
            </CardTitle>
            <CardDescription>Track and update your weekly creator targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {weeklyGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const display = goal.unit === "$" ? formatCurrency(goal.current) : `${formatNumber(goal.current)} ${goal.unit}`;
              const targetDisplay = goal.unit === "$" ? formatCurrency(goal.target) : `${formatNumber(goal.target)}`;
              return (
                <div key={goal.id}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{goal.label}</span>
                    <span className="text-xs text-muted-foreground">{display} / {targetDisplay}</span>
                  </div>
                  <Progress value={pct} className="mb-2" />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateWeeklyGoal(goal.id, Math.min(goal.target, goal.current + 1))}>
                      +1
                    </Button>
                    <Badge variant={pct >= 100 ? "success" : pct >= 50 ? "warning" : "secondary"}>{pct}%</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" /> Grok Insights
            </CardTitle>
            <CardDescription>AI-powered recommendations for your studio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {GROK_INSIGHTS.map((item, i) => (
              <div key={i} className="rounded-lg border border-border/50 bg-secondary/20 p-4 transition-all hover:border-primary/30">
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge variant={item.priority === "high" ? "warning" : item.priority === "medium" ? "secondary" : "outline"} className="text-[10px]">
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass mt-6">
        <CardHeader>
          <CardTitle>This Week's Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3"><span className="font-mono text-accent">01</span> Publish Q3 channel update by Thursday</li>
            <li className="flex gap-3"><span className="font-mono text-accent">02</span> Generate and schedule 5 Shorts from last stream</li>
            <li className="flex gap-3"><span className="font-mono text-accent">03</span> Follow up on Nova Studios collab contract</li>
            <li className="flex gap-3"><span className="font-mono text-accent">04</span> Hit $8K weekly revenue target — $2.8K to go</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}