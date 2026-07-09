"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PLATFORM_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { RevenueEntry } from "@/lib/store";

type PlatformPieProps = {
  entries: RevenueEntry[];
};

export function PlatformPie({ entries }: PlatformPieProps) {
  const grouped = entries.reduce<Record<string, number>>((acc, e) => {
    const key = e.platform;
    acc[key] = (acc[key] ?? 0) + e.amount;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
    color: PLATFORM_COLORS[name] ?? "#6B7280",
  }));

  if (data.length === 0) {
    return <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">No revenue data</div>;
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(240, 5%, 7%)",
              border: "1px solid hsl(240, 4%, 14%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex flex-wrap gap-3 sm:flex-col">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-medium">{formatCurrency(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}