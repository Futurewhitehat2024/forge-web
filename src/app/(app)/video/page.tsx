"use client";

import { useState } from "react";
import { Upload, Scissors, Edit3, Send, Play, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForgeStore } from "@/lib/store";
import { PLATFORMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function VideoPage() {
  const sourceVideo = useForgeStore((s) => s.sourceVideo);
  const generatedClips = useForgeStore((s) => s.generatedClips);
  const uploadQueue = useForgeStore((s) => s.uploadQueue);
  const setSourceVideo = useForgeStore((s) => s.setSourceVideo);
  const generateClips = useForgeStore((s) => s.generateClips);
  const updateClip = useForgeStore((s) => s.updateClip);
  const updateUploadProgress = useForgeStore((s) => s.updateUploadProgress);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("YouTube");
  const [editingClip, setEditingClip] = useState<string | null>(null);

  const handleUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setSourceVideo({
            id: "sv1",
            name: "creator-vlog-ep42.mp4",
            duration: "24:18",
            size: "1.2 GB",
            uploadedAt: new Date().toISOString(),
            status: "ready",
          });
          return 100;
        }
        return p + 10;
      });
    }, 200);
  };

  const handlePublish = () => {
    const id = Math.random().toString(36).slice(2);
    useForgeStore.setState((s) => ({
      uploadQueue: [...s.uploadQueue, { id, name: "Highlight Reel", platform: selectedPlatform as typeof PLATFORMS[number], progress: 0, status: "uploading" }],
    }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      updateUploadProgress(id, progress, progress >= 100 ? "complete" : "uploading");
      if (progress >= 100) clearInterval(interval);
    }, 300);
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Video Studio"
        description="Upload long-form content, auto-generate 20 clips, edit, and publish across platforms."
      />

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload"><Upload className="mr-1.5 h-3.5 w-3.5" />Upload</TabsTrigger>
          <TabsTrigger value="clips"><Scissors className="mr-1.5 h-3.5 w-3.5" />Auto-Clip</TabsTrigger>
          <TabsTrigger value="edit"><Edit3 className="mr-1.5 h-3.5 w-3.5" />Edit</TabsTrigger>
          <TabsTrigger value="publish"><Send className="mr-1.5 h-3.5 w-3.5" />Publish</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Source Video</CardTitle>
              <CardDescription>Upload your long-form video to begin the clip pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              {!sourceVideo && !uploading ? (
                <div
                  onClick={handleUpload}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-secondary/20 py-16 transition-all hover:border-primary/50 hover:bg-secondary/40"
                >
                  <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="font-medium">Drop video or click to upload</p>
                  <p className="mt-1 text-xs text-muted-foreground">MP4, MOV up to 5 GB</p>
                </div>
              ) : uploading ? (
                <div className="space-y-3 py-8">
                  <p className="text-sm text-muted-foreground">Uploading creator-vlog-ep42.mp4…</p>
                  <Progress value={uploadProgress} />
                  <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                </div>
              ) : sourceVideo ? (
                <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-secondary/20 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{sourceVideo.name}</p>
                    <p className="text-xs text-muted-foreground">{sourceVideo.duration} · {sourceVideo.size}</p>
                  </div>
                  <Badge variant="success">Ready</Badge>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clips">
          <Card className="glass">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Auto-Clip Generator</CardTitle>
                <CardDescription>AI detects highlight moments and creates 20 short-form clips</CardDescription>
              </div>
              <Button variant="accent" disabled={!sourceVideo} onClick={generateClips}>
                <Scissors className="h-3.5 w-3.5" /> Generate 20 Clips
              </Button>
            </CardHeader>
            <CardContent>
              {generatedClips.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  {sourceVideo ? "Click generate to create clips from your source video" : "Upload a source video first"}
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {generatedClips.map((clip) => (
                    <div
                      key={clip.id}
                      className={cn(
                        "cursor-pointer rounded-xl border border-border/50 bg-secondary/20 p-3 transition-all hover:border-primary/40",
                        editingClip === clip.id && "border-accent ring-1 ring-accent"
                      )}
                      onClick={() => setEditingClip(clip.id)}
                    >
                      <div className="mb-2 flex aspect-video items-center justify-center rounded-lg bg-muted/50">
                        <Play className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="truncate text-xs font-medium">{clip.title}</p>
                      <p className="text-[10px] text-muted-foreground">{clip.startTime} – {clip.endTime}</p>
                      <Badge variant="outline" className="mt-1.5 text-[10px]">{clip.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Clip Editor</CardTitle>
              <CardDescription>Fine-tune titles, trim points, and captions</CardDescription>
            </CardHeader>
            <CardContent>
              {editingClip && generatedClips.find((c) => c.id === editingClip) ? (
                <div className="space-y-4">
                  <div className="flex aspect-video items-center justify-center rounded-xl bg-muted/30">
                    <Play className="h-12 w-12 text-primary" />
                  </div>
                  <p className="font-medium">{generatedClips.find((c) => c.id === editingClip)?.title}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateClip(editingClip, { status: "editing" })}>Mark Editing</Button>
                    <Button size="sm" variant="outline" onClick={() => updateClip(editingClip, { status: "ready" })}>
                      <Check className="h-3.5 w-3.5" /> Mark Ready
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">Select a clip from Auto-Clip tab to edit</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publish">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Publish to Platform</CardTitle>
              <CardDescription>Queue clips for multi-platform distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="accent" onClick={handlePublish}>
                  <Send className="h-3.5 w-3.5" /> Publish Highlight Reel
                </Button>
              </div>
              {uploadQueue.length > 0 && (
                <div className="space-y-2">
                  {uploadQueue.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border/50 p-3">
                      <div className="mb-2 flex justify-between text-sm">
                        <span>{item.name} → {item.platform}</span>
                        <Badge variant={item.status === "complete" ? "success" : "secondary"}>{item.status}</Badge>
                      </div>
                      <Progress value={item.progress} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}