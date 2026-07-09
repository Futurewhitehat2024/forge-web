"use client";

import { useState } from "react";
import { Calculator, BookOpen, PiggyBank, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LESSONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function FinancePage() {
  const [income, setIncome] = useState("10000");
  const [taxRate, setTaxRate] = useState("30");
  const [views, setViews] = useState("100000");
  const [cpm, setCpm] = useState("25");
  const [fixedCosts, setFixedCosts] = useState("2000");
  const [pricePerUnit, setPricePerUnit] = useState("50");
  const [savingsGoal, setSavingsGoal] = useState("15000");
  const [monthlySave, setMonthlySave] = useState("1500");

  const taxOwed = (Number(income) * Number(taxRate)) / 100;
  const sponsorship = (Number(views) / 1000) * Number(cpm);
  const breakEven = Number(fixedCosts) / Number(pricePerUnit);
  const monthsToGoal = Math.ceil(Number(savingsGoal) / Number(monthlySave));

  return (
    <div className="page-enter">
      <PageHeader
        title="Financial Literacy"
        description="Playbooks and calculators to run your creator business like a pro."
      />

      <Tabs defaultValue="playbooks">
        <TabsList>
          <TabsTrigger value="playbooks"><BookOpen className="mr-1.5 h-3.5 w-3.5" />Playbooks</TabsTrigger>
          <TabsTrigger value="calculators"><Calculator className="mr-1.5 h-3.5 w-3.5" />Calculators</TabsTrigger>
        </TabsList>

        <TabsContent value="playbooks">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(LESSONS).map(([title, content]) => (
              <Card key={title} className="glass transition-all hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculators">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calculator className="h-4 w-4 text-primary" /> Tax Estimator
                </CardTitle>
                <CardDescription>Set aside the right amount for quarterly taxes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Gross Income ($)</Label>
                    <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Tax Rate (%)</Label>
                    <Input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/40 p-4">
                  <p className="text-xs text-muted-foreground">Estimated tax owed</p>
                  <p className="text-2xl font-semibold text-accent">{formatCurrency(taxOwed)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Keep {formatCurrency(taxOwed / 4)} per quarter</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-primary" /> Sponsorship Calculator
                </CardTitle>
                <CardDescription>CPM × views with brand-fit premium</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Expected Views</Label>
                    <Input type="number" value={views} onChange={(e) => setViews(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>CPM ($)</Label>
                    <Input type="number" value={cpm} onChange={(e) => setCpm(e.target.value)} />
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/40 p-4">
                  <p className="text-xs text-muted-foreground">Suggested rate</p>
                  <p className="text-2xl font-semibold text-primary">{formatCurrency(sponsorship)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">Break-Even Calculator</CardTitle>
                <CardDescription>Units needed to cover fixed costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Fixed Costs ($)</Label>
                    <Input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Price per Unit ($)</Label>
                    <Input type="number" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} />
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/40 p-4">
                  <p className="text-xs text-muted-foreground">Break-even units</p>
                  <p className="text-2xl font-semibold">{Math.ceil(breakEven)} units</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <PiggyBank className="h-4 w-4 text-accent" /> Savings Planner
                </CardTitle>
                <CardDescription>Time to reach your financial goal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Savings Goal ($)</Label>
                    <Input type="number" value={savingsGoal} onChange={(e) => setSavingsGoal(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Monthly Savings ($)</Label>
                    <Input type="number" value={monthlySave} onChange={(e) => setMonthlySave(e.target.value)} />
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/40 p-4">
                  <p className="text-xs text-muted-foreground">Months to goal</p>
                  <p className="text-2xl font-semibold">{monthsToGoal} months</p>
                  <p className="mt-1 text-xs text-muted-foreground">Target date: {new Date(Date.now() + monthsToGoal * 30 * 86400000).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}