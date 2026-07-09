"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForgeStore } from "@/lib/store";
import { PLATFORMS } from "@/lib/constants";

export default function ContentPage() {
  const ideas = useForgeStore((s) => s.ideas);
  const drafts = useForgeStore((s) => s.drafts);
  const evergreen = useForgeStore((s) => s.evergreen);
  const calendarEvents = useForgeStore((s) => s.calendarEvents);
  const addIdea = useForgeStore((s) => s.addIdea);
  const deleteIdea = useForgeStore((s) => s.deleteIdea);
  const addDraft = useForgeStore((s) => s.addDraft);
  const deleteDraft = useForgeStore((s) => s.deleteDraft);
  const addEvergreen = useForgeStore((s) => s.addEvergreen);
  const addCalendarEvent = useForgeStore((s) => s.addCalendarEvent);
  const deleteCalendarEvent = useForgeStore((s) => s.deleteCalendarEvent);

  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaPlatform, setIdeaPlatform] = useState<string>("YouTube");
  const [draftTitle, setDraftTitle] = useState("");
  const [eventTitle, setEventTitle] = useState("");

  return (
    <div className="page-enter">
      <PageHeader
        title="Content Hub"
        description="Capture ideas, manage drafts, schedule posts, and track evergreen performers."
        actions={
          <Button variant="accent" size="sm">
            <Sparkles className="h-3.5 w-3.5" /> AI Brainstorm
          </Button>
        }
      />

      <Tabs defaultValue="ideas">
        <TabsList>
          <TabsTrigger value="ideas">Ideas & Drafts</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="evergreen">Evergreen</TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">Content Ideas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="New idea title…" value={ideaTitle} onChange={(e) => setIdeaTitle(e.target.value)} />
                  <Select value={ideaPlatform} onValueChange={setIdeaPlatform}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button
                    size="icon"
                    onClick={() => {
                      if (!ideaTitle.trim()) return;
                      addIdea({ title: ideaTitle, platform: ideaPlatform as typeof PLATFORMS[number], notes: "", status: "idea" });
                      setIdeaTitle("");
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-3">
                      <div>
                        <p className="text-sm font-medium">{idea.title}</p>
                        <div className="mt-1 flex gap-2">
                          <Badge variant="outline" className="text-[10px]">{idea.platform}</Badge>
                          <Badge variant="secondary" className="text-[10px]">{idea.status}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteIdea(idea.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">Drafts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>New draft</Label>
                  <Input placeholder="Draft title…" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
                  <Textarea placeholder="Content outline or script…" className="min-h-[80px]" id="draft-content" />
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const content = (document.getElementById("draft-content") as HTMLTextAreaElement)?.value ?? "";
                      if (!draftTitle.trim()) return;
                      addDraft({ title: draftTitle, platform: "YouTube", content, status: "draft" });
                      setDraftTitle("");
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" /> Save Draft
                  </Button>
                </div>
                <div className="space-y-2">
                  {drafts.map((draft) => (
                    <div key={draft.id} className="rounded-lg border border-border/50 bg-secondary/20 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">{draft.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{draft.content}</p>
                          <div className="mt-2 flex gap-2">
                            <Badge variant="outline" className="text-[10px]">{draft.platform}</Badge>
                            <Badge variant={draft.status === "scheduled" ? "success" : "secondary"} className="text-[10px]">{draft.status}</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteDraft(draft.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card className="glass">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Content Calendar</CardTitle>
              <div className="flex gap-2">
                <Input placeholder="Event title…" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-48" />
                <Button
                  size="sm"
                  onClick={() => {
                    if (!eventTitle.trim()) return;
                    addCalendarEvent({ title: eventTitle, platform: "YouTube", date: new Date().toISOString().split("T")[0], type: "publish" });
                    setEventTitle("");
                  }}
                >
                  <Calendar className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {calendarEvents.map((event) => (
                  <div key={event.id} className="group rounded-xl border border-border/50 bg-secondary/20 p-4 transition-all hover:border-primary/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2 text-[10px]">{event.type}</Badge>
                        <p className="font-medium">{event.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{event.platform} · {event.date}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => deleteCalendarEvent(event.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evergreen" className="space-y-6">
          <Card className="glass">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Evergreen Library</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addEvergreen({ title: "New evergreen piece", platform: "YouTube", performance: "medium", lastUpdated: new Date().toISOString().split("T")[0] })}
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {evergreen.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border/50 bg-secondary/20 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.platform} · Updated {item.lastUpdated}</p>
                      </div>
                      <Badge variant={item.performance === "high" ? "success" : item.performance === "medium" ? "warning" : "secondary"}>
                        {item.performance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}