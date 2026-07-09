"use client";

import { useState } from "react";
import { Lightbulb, Rocket, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { PLATFORM_TIPS, PLATFORMS } from "@/lib/constants";

const LAUNCH_CHECKLIST = [
  "Define niche and target audience",
  "Set up branding (logo, banner, bio)",
  "Create content calendar for first 30 days",
  "Batch-record 5 pillar videos",
  "Set up analytics tracking",
  "Build email list or Discord community",
  "Plan first sponsorship outreach",
  "Schedule cross-platform promotion",
];

export default function AdvicePage() {
  const [checked, setChecked] = useState<Set<number>>(new Set([0, 1, 2]));
  const [grokPrompt, setGrokPrompt] = useState("");
  const [grokResponse, setGrokResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleCheck = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const runGrokStrategy = () => {
    if (!grokPrompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setGrokResponse(
        `Strategy for: "${grokPrompt}"\n\n` +
        `1. **Content Pillar**: Focus on 3 repeatable formats — tutorials, behind-the-scenes, and reaction/commentary.\n` +
        `2. **Distribution**: Publish long-form on YouTube, clip to TikTok/Reels within 24h, tease on X.\n` +
        `3. **Growth Loop**: End every video with a community CTA. Pin best-performing clip weekly.\n` +
        `4. **Monetization**: Layer AdSense + 1 mid-tier sponsorship/month + digital product by Q4.\n` +
        `5. **90-Day Target**: +2,500 subs, 4 sponsor conversations, $3K/mo run-rate.`
      );
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Content Advice"
        description="Platform growth guides, Grok strategy lab, and your launch checklist."
      />

      <Tabs defaultValue="guides">
        <TabsList>
          <TabsTrigger value="guides"><Lightbulb className="mr-1.5 h-3.5 w-3.5" />Growth Guides</TabsTrigger>
          <TabsTrigger value="grok"><Sparkles className="mr-1.5 h-3.5 w-3.5" />Grok Strategy Lab</TabsTrigger>
          <TabsTrigger value="launch"><Rocket className="mr-1.5 h-3.5 w-3.5" />Launch Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="guides">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.filter((p) => PLATFORM_TIPS[p]).map((platform) => (
              <Card key={platform} className="glass">
                <CardHeader>
                  <CardTitle className="text-base">{platform}</CardTitle>
                  <CardDescription>Top growth tactics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {PLATFORM_TIPS[platform].map((tip, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grok">
          <Card className="glass max-w-2xl">
            <CardHeader>
              <CardTitle>Grok Strategy Lab</CardTitle>
              <CardDescription>Describe your niche, goals, or challenge — get a tailored growth plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="e.g. I'm a gaming creator with 15K subs wanting to hit 50K in 6 months..."
                value={grokPrompt}
                onChange={(e) => setGrokPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              <Button variant="accent" onClick={runGrokStrategy} disabled={loading}>
                <Sparkles className="h-3.5 w-3.5" />
                {loading ? "Thinking…" : "Generate Strategy"}
              </Button>
              {grokResponse && (
                <div className="rounded-lg border border-border/50 bg-secondary/20 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {grokResponse}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="launch">
          <Card className="glass max-w-xl">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Launch Checklist</CardTitle>
                <CardDescription>{checked.size}/{LAUNCH_CHECKLIST.length} complete</CardDescription>
              </div>
              <Badge variant={checked.size === LAUNCH_CHECKLIST.length ? "success" : "warning"}>
                {Math.round((checked.size / LAUNCH_CHECKLIST.length) * 100)}%
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {LAUNCH_CHECKLIST.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className="flex w-full items-center gap-3 rounded-lg border border-border/50 bg-secondary/20 p-3 text-left text-sm transition-all hover:bg-secondary/40"
                >
                  {checked.has(i) ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={checked.has(i) ? "text-muted-foreground line-through" : ""}>{item}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}