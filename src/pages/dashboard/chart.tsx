import "./styles.css";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Boundary } from "@/components/ui/Boundary";
import { Response } from ".";
import type { Revenue } from "./types";

export function ChartInner(p: Revenue) {
  const { total, revenues, type, range } = p;

  const chartConfig = useMemo(
    () =>
      revenues.reduce(
        (acc, { subtype }, i) => ({
          ...acc,
          [subtype]: { label: subtype, color: `hsl(var(--chart-${i + 1}))` },
        }),
        { total_revenue: { label: type } },
      ),
    [revenues, type],
  );

  const chartData = useMemo(
    () =>
      revenues.map((data) => ({
        ...data,
        total_revenue: Math.round(data.revenue),
        fill: `var(--color-${data.subtype})`,
      })),
    [revenues],
  );

  return (
    <div className="flex flex-col w-80">
      <CardHeader className="items-center pb-0">
        <CardTitle>Current {type}</CardTitle>
        <CardDescription>{range}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="total_revenue"
              nameKey="subtype"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-3xl font-bold"
                        >
                          {Math.round(total).toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white"
                        >
                          Total revenue
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}

const ChartResolver = (p: Response) => {
  if ("error" in p && p.error !== null) throw Error(p.error?.message);

  if (!p.data) return null;

  return <ChartInner {...p.data} />;
};

export const Chart = (p: Response) => (
  <Boundary>
    <ChartResolver {...p} />
  </Boundary>
);
