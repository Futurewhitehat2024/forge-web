"use client";

import { useState } from "react";
import { Link2, Unlink, FileText, Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForgeStore } from "@/lib/store";
import { PLATFORMS, PLATFORM_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
export default function RevenuePage() {
  const connectedPlatforms = useForgeStore((s) => s.connectedPlatforms);
  const revenueEntries = useForgeStore((s) => s.revenueEntries);
  const splitConfig = useForgeStore((s) => s.splitConfig);
  const generatedContract = useForgeStore((s) => s.generatedContract);
  const connectPlatform = useForgeStore((s) => s.connectPlatform);
  const disconnectPlatform = useForgeStore((s) => s.disconnectPlatform);
  const addRevenueEntry = useForgeStore((s) => s.addRevenueEntry);
  const calculateSplits = useForgeStore((s) => s.calculateSplits);
  const generateContract = useForgeStore((s) => s.generateContract);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="page-enter">
      <PageHeader
        title="Revenue & Payouts"
        description="Link platform accounts, track transactions, manage splits, and generate contracts."
      />

      <Tabs defaultValue="accounts">
        <TabsList>
          <TabsTrigger value="accounts">Link Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="splits">Splits</TabsTrigger>
          <TabsTrigger value="contract">Contract</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PLATFORMS.map((platform) => {
              const p = connectedPlatforms[platform];
              return (
                <Card key={platform} className="glass">
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: PLATFORM_COLORS[platform] }} />
                      <span className="font-medium">{platform}</span>
                    </div>
                    {p.connected ? (
                      <>
                        <p className="text-xs text-muted-foreground">{p.handle}</p>
                        <p className="mt-1 text-sm font-semibold">{formatCurrency(p.monthlyRevenue ?? 0)}/mo</p>
                        <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => disconnectPlatform(platform)}>
                          <Unlink className="h-3 w-3" /> Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="mt-2 w-full" onClick={() => connectPlatform(platform, `@forge${platform.toLowerCase()}`)}>
                        <Link2 className="h-3 w-3" /> Connect
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Add Transaction</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <div className="space-y-1">
                <Label>Amount</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-32" />
              </div>
              <div className="flex-1 space-y-1">
                <Label>Description</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Sponsorship, payout, etc." />
              </div>
              <Button
                className="self-end"
                onClick={() => {
                  if (!amount) return;
                  addRevenueEntry({
                    platform: "Other",
                    amount: Number(amount),
                    date: new Date().toISOString().split("T")[0],
                    description: description || "Manual entry",
                    status: "pending",
                  });
                  setAmount("");
                  setDescription("");
                }}
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {revenueEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-medium">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">{entry.platform} · {entry.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={entry.status === "paid" ? "success" : entry.status === "processing" ? "warning" : "secondary"}>
                        {entry.status}
                      </Badge>
                      <span className="font-semibold">{formatCurrency(entry.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="splits">
          <Card className="glass">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Split Calculator</CardTitle>
                <CardDescription>{splitConfig.period} — {formatCurrency(splitConfig.totalRevenue)} total</CardDescription>
              </div>
              <Button size="sm" onClick={calculateSplits}>Recalculate</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {splitConfig.members.map((m) => (
                  <div key={m.id} className="flex justify-between rounded-lg bg-secondary/30 px-4 py-3 text-sm">
                    <span>{m.name}</span>
                    <span className="font-medium">{m.percent}% — {formatCurrency((splitConfig.totalRevenue * m.percent) / 100)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contract">
          <Card className="glass">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Contract Generator</CardTitle>
                <CardDescription>Auto-generate a revenue split agreement from your team config</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { calculateSplits(); generateContract(); }}>
                  <FileText className="h-3.5 w-3.5" /> Generate
                </Button>
                {generatedContract && (
                  <Button size="sm" variant="outline" onClick={() => {
                    const blob = new Blob([generatedContract], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "revenue-split-agreement.txt";
                    a.click();
                  }}>
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedContract ? (
                <pre className="max-h-[400px] overflow-auto rounded-lg border border-border/50 bg-secondary/20 p-4 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {generatedContract}
                </pre>
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">Click Generate to create your split contract</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}