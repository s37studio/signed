"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProposalsChartProps = {
  proposals: any[];
};

export function ProposalsChart({ proposals }: ProposalsChartProps) {
  const data = useMemo(() => {
    // Group proposals by date
    const grouped = proposals.reduce((acc, proposal) => {
      const date = new Date(proposal.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      acc[date] = (acc[date] || 0) + 1; // Count proposals for now, as we don't have value
      return acc;
    }, {} as Record<string, number>);

    // Fill in missing dates if needed, or just sort keys
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    // If no data, provide some dummy data for visualization
    if (sortedDates.length === 0) {
      return [
        { date: "01 Feb 2026", value: 2400 },
        { date: "05 Feb 2026", value: 1398 },
        { date: "10 Feb 2026", value: 9800 },
        { date: "15 Feb 2026", value: 3908 },
        { date: "20 Feb 2026", value: 4800 },
        { date: "25 Feb 2026", value: 3800 },
        { date: "28 Feb 2026", value: 4300 },
      ];
    }

    const result = sortedDates.map((date) => ({
      date,
      value: grouped[date],
    }));

    // If only one data point, add a previous day with 0 value to make a line
    if (result.length === 1) {
      const date = new Date(sortedDates[0]);
      date.setDate(date.getDate() - 1);
      const prevDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      result.unshift({ date: prevDate, value: 0 });
    }

    return result;
  }, [proposals]);

  const totalValue = useMemo(() => {
    // Sum of values (counts for now)
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);

  return (
    <Card className="bg-transparent border-[0.5px] border-zinc-800/50 rounded-[20px] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-2 pb-2 pl-6">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Sales Amount
          </CardTitle>
          <div className="text-2xl font-medium text-zinc-50">
            €{totalValue.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[100px] w-full px-3 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 8,
                right: 8,
                left: 8,
                bottom: 8,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.06} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                hide
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide axisLine={false} tickLine={false} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between px-6 pb-4 text-xs text-muted-foreground">
          <span>{data[0]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </CardContent>
    </Card>
  );
}
