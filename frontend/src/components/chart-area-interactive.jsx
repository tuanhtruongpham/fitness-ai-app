"use client"

import * as React from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Member activity chart"

const chartData = [
  { label: "Apr 1", workouts: 42, meals: 30 },
  { label: "Apr 15", workouts: 56, meals: 38 },
  { label: "May 1", workouts: 64, meals: 45 },
  { label: "May 15", workouts: 78, meals: 54 },
  { label: "Jun 1", workouts: 70, meals: 62 },
  { label: "Jun 15", workouts: 86, meals: 72 },
  { label: "Jun 30", workouts: 92, meals: 80 },
]

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Member Activity</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Workouts and meal plans for the selected period
          </span>
          <span className="@[540px]/card:hidden">Activity overview</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex">
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex h-[250px] items-end gap-3 rounded-lg border border-border bg-background/60 p-4">
          {chartData.map((item) => (
            <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-44 w-full items-end justify-center gap-1">
                <div
                  className="w-3 rounded-t bg-primary shadow-[0_0_20px_rgba(132,204,22,0.35)]"
                  style={{ height: `${item.workouts}%` }}
                  title={`${item.workouts} workouts`}
                />
                <div
                  className="w-3 rounded-t bg-chart-3/80"
                  style={{ height: `${item.meals}%` }}
                  title={`${item.meals} meal plans`}
                />
              </div>
              <span className="truncate text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" />
            Workouts
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-chart-3" />
            Meal Plans
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
