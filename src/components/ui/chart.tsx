/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";

type ApiResponse = {
  url: string;
  method: string;
  status: number;
  latency: number;
  timestamp: number;
};

type Props = {
  data: ApiResponse[];
};

function getLabel(url: string) {
  try {
    const { hostname, pathname } = new URL(url);
    return `${hostname}${pathname}`;
  } catch {
    return url;
  }
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const { latency, status } = payload[0].payload;
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "8px",
        padding: "6px 10px",
        fontSize: "11px",
        // color: "#93c5fd",
        lineHeight: "1.6",
      }}
    >
      <div>{latency} ms</div>
      <div>status: {status}</div>
    </div>
  );
}

export function Chart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center border rounded text-gray-500">
        No API data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    api: getLabel(item.url),
    latency: item.latency,
    status: item.status,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          barCategoryGap="40%"
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="api"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(value) => `${value} ms`}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={65}
          />

          <Tooltip
            cursor={false}
            active={activeIndex !== null}
            content={<CustomTooltip />}
          />

          <Bar
            dataKey="latency"
            radius={[4, 4, 0, 0]}
            maxBarSize={72}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? "#2563eb" : "#3b82f6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
