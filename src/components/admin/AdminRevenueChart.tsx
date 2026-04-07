"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { date: string; revenue: number }[];
}

function formatRupee(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

export default function AdminRevenueChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm font-body">
        No revenue data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C9A6A6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#C9A6A6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "var(--font-dm-sans)" }}
          tickFormatter={(v) => v.slice(5)}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "var(--font-dm-sans)" }}
          tickFormatter={formatRupee}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
          contentStyle={{
            fontSize: 12,
            fontFamily: "var(--font-dm-sans)",
            border: "1px solid #E5E7EB",
            borderRadius: 4,
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#C9A6A6"
          strokeWidth={2}
          fill="url(#revenueGrad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
