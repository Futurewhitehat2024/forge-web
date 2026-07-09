"use client";

import { useTheme } from "next-themes";
import { Building2, RefreshCw, Bell, Moon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForgeStore } from "@/lib/store";

export default function SettingsPage() {
  const settings = useForgeStore((s) => s.settings);
  const syncLog = useForgeStore((s) => s.syncLog);
  const isSyncing = useForgeStore((s) => s.isSyncing);
  const updateSettings = useForgeStore((s) => s.updateSettings);
  const syncAll = useForgeStore((s) => s.syncAll);
  const { theme, setTheme } = useTheme();

  return (
    <div className="page-enter">
      <PageHeader
        title="Settings"
        description="Studio profile, sync preferences, alerts, and appearance."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" /> Studio Profile
            </CardTitle>
            <CardDescription>Your workspace identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Studio Name</Label>
              <Input value={settings.studioName} onChange={(e) => updateSettings({ studioName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Workspace</Label>
              <Input value={settings.workspace} onChange={(e) => updateSettings({ workspace: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={settings.email} onChange={(e) => updateSettings({ email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={settings.timezone} onValueChange={(v) => updateSettings({ timezone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="h-4 w-4" /> Sync
            </CardTitle>
            <CardDescription>Platform data synchronization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-sync</p>
                <p className="text-xs text-muted-foreground">Automatically pull platform data</p>
              </div>
              <Switch checked={settings.autoSync} onCheckedChange={(v) => updateSettings({ autoSync: v })} />
            </div>
            <div className="space-y-2">
              <Label>Sync interval (minutes)</Label>
              <Select value={String(settings.syncInterval)} onValueChange={(v) => updateSettings({ syncInterval: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => syncAll()} disabled={isSyncing} className="w-full">
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing…" : "Sync Now"}
            </Button>
            {syncLog.length > 0 && (
              <div className="max-h-32 space-y-1 overflow-auto rounded-lg bg-secondary/30 p-3">
                {syncLog.slice(0, 5).map((log) => (
                  <p key={log.id} className="text-[10px] text-muted-foreground">
                    [{log.status}] {log.platform}: {log.message}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" /> Alerts
            </CardTitle>
            <CardDescription>Notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email alerts</p>
                <p className="text-xs text-muted-foreground">Weekly digest and important updates</p>
              </div>
              <Switch checked={settings.emailAlerts} onCheckedChange={(v) => updateSettings({ emailAlerts: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Revenue alerts</p>
                <p className="text-xs text-muted-foreground">Notify on new payouts and milestones</p>
              </div>
              <Switch checked={settings.revenueAlerts} onCheckedChange={(v) => updateSettings({ revenueAlerts: v })} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Moon className="h-4 w-4" /> Appearance
            </CardTitle>
            <CardDescription>Theme and display settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-xs text-muted-foreground">Use dark theme (recommended)</p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(v) => {
                  setTheme(v ? "dark" : "light");
                  updateSettings({ darkMode: v });
                }}
              />
            </div>
            <div className="flex gap-2">
              {(["dark", "light", "system"] as const).map((t) => (
                <Button key={t} variant={theme === t ? "default" : "outline"} size="sm" onClick={() => setTheme(t)} className="capitalize">
                  {t}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}