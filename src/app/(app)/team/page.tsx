"use client";

import { useState } from "react";
import { UserPlus, Mail, Percent, Handshake } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForgeStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function TeamPage() {
  const team = useForgeStore((s) => s.team);
  const collabProjects = useForgeStore((s) => s.collabProjects);
  const splitConfig = useForgeStore((s) => s.splitConfig);
  const addTeamMember = useForgeStore((s) => s.addTeamMember);
  const calculateSplits = useForgeStore((s) => s.calculateSplits);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleInvite = () => {
    if (!name.trim() || !email.trim()) return;
    addTeamMember({ name, email, role: role || "Contributor", splitPercent: 0, status: "invited" });
    setName("");
    setEmail("");
    setRole("");
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Team & Collabs"
        description="Manage your roster, collaboration projects, and revenue splits."
        actions={
          <Button variant="accent" size="sm" onClick={calculateSplits}>
            <Percent className="h-3.5 w-3.5" /> Recalculate Splits
          </Button>
        }
      />

      <Tabs defaultValue="roster">
        <TabsList>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="collabs">Collabs</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="splits">Revenue Splits</TabsTrigger>
        </TabsList>

        <TabsContent value="roster">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Card key={member.id} className="glass transition-all hover:border-primary/30">
                <CardContent className="flex items-center gap-4 p-5">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                    <div className="mt-1.5 flex gap-2">
                      <Badge variant={member.status === "active" ? "success" : member.status === "invited" ? "warning" : "secondary"} className="text-[10px]">
                        {member.status}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{member.splitPercent}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collabs">
          <div className="grid gap-4 sm:grid-cols-2">
            {collabProjects.map((project) => (
              <Card key={project.id} className="glass">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-accent/10 p-2">
                        <Handshake className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground">with {project.partner}</p>
                      </div>
                    </div>
                    <Badge variant={project.status === "active" ? "success" : project.status === "completed" ? "secondary" : "warning"}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    <span className="text-muted-foreground">{project.platform}</span>
                    <span className="font-medium">{formatCurrency(project.revenue)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Due {project.dueDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invites">
          <Card className="glass max-w-lg">
            <CardHeader>
              <CardTitle className="text-base">Invite Team Member</CardTitle>
              <CardDescription>Send an invite to join your Forge workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Editor, Designer, etc." />
              </div>
              <Button onClick={handleInvite} className="w-full">
                <UserPlus className="h-3.5 w-3.5" /> Send Invite
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="splits">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Revenue Split — {splitConfig.period}</CardTitle>
              <CardDescription>Total pool: {formatCurrency(splitConfig.totalRevenue)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {splitConfig.members.map((m) => {
                  const amount = (splitConfig.totalRevenue * m.percent) / 100;
                  return (
                    <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{m.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(amount)}</p>
                        <p className="text-xs text-muted-foreground">{m.percent}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}