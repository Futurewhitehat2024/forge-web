"use client";

import { useState } from "react";
import { Upload, Image, Video, Music, File, Trash2, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useForgeStore } from "@/lib/store";
import type { Asset } from "@/lib/store";

const typeIcons: Record<Asset["type"], typeof Image> = {
  image: Image,
  video: Video,
  audio: Music,
  template: File,
  other: File,
};

export default function AssetsPage() {
  const assets = useForgeStore((s) => s.assets);
  const addAsset = useForgeStore((s) => s.addAsset);
  const deleteAsset = useForgeStore((s) => s.deleteAsset);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Asset["type"] | "all">("all");

  const filtered = assets.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.includes(search.toLowerCase()));
    const matchFilter = filter === "all" || a.type === filter;
    return matchSearch && matchFilter;
  });

  const handleUpload = () => {
    addAsset({
      name: `asset-${Date.now()}.png`,
      type: "image",
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      tags: ["uploaded"],
    });
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Asset Library"
        description="Centralized storage for thumbnails, intros, audio, templates, and brand files."
        actions={
          <Button variant="accent" size="sm" onClick={handleUpload}>
            <Upload className="h-3.5 w-3.5" /> Upload Asset
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search assets…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {(["all", "image", "video", "audio", "template"] as const).map((t) => (
            <Button key={t} variant={filter === t ? "default" : "outline"} size="sm" onClick={() => setFilter(t)}>
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div
        onClick={handleUpload}
        className="mb-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-secondary/10 py-10 transition-all hover:border-primary/40 hover:bg-secondary/30"
      >
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">Drop files here or click to upload</p>
        <p className="text-xs text-muted-foreground">Images, video, audio, templates</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((asset) => {
          const Icon = typeIcons[asset.type];
          return (
            <Card key={asset.id} className="glass group transition-all hover:border-primary/30">
              <CardContent className="p-4">
                <div className="mb-3 flex aspect-square items-center justify-center rounded-lg bg-secondary/40">
                  <Icon className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.size} · {asset.uploadedAt}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-[10px]">{asset.type}</Badge>
                      {asset.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 opacity-0 group-hover:opacity-100" onClick={() => deleteAsset(asset.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">No assets match your search</p>
      )}
    </div>
  );
}