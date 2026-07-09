"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";

const data = [
  { month: "Jan", revenue: 6200 },
  { month: "Feb", revenue: 7100 },
  { month: "Mar", revenue: 6800 },
  { month: "Apr", revenue: 8400 },
  { month: "May", revenue: 9200 },
  { month: "Jun", revenue: 10100 },
  { month: "Jul", revenue: 13310 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 4%, 14%)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(240, 5%, 7%)",
            border: "1px solid hsl(240, 4%, 14%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number) => [formatCurrency(value), "Revenue"]}
        />
        <Area type="monotone" dataKey="revenue" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#revenueGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}