/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { useApiHistory } from "@/store/api-history";

export function Dashboard() {
  const { history } = useApiHistory();

  const [range, setRange] = useState<"7" | "30">("7");
const [currentTime] = useState(() => new Date().getTime());

  const filteredHistory = useMemo(() => {
  const days = Number(range);

  return history.filter((item: any) => {
    const diff = currentTime - item.timestamp;

    return diff <= days * 24 * 60 * 60 * 1000;
  });
}, [history, range, currentTime]);

  const totalRequests = filteredHistory.length;

  const avgLatency = filteredHistory.length
    ? Math.round(
        filteredHistory.reduce(
          (acc: number, item: any) => acc + item.latency,
          0,
        ) / filteredHistory.length,
      )
    : 0;

  const error4xx = filteredHistory.filter(
    (item: any) => item.status >= 400 && item.status < 500,
  ).length;

  const error5xx = filteredHistory.filter(
    (item: any) => item.status >= 500,
  ).length;

  const successRate = totalRequests
    ? Math.round(((totalRequests - error4xx - error5xx) / totalRequests) * 100)
    : 0;

  const lineChartData = filteredHistory.map((item: any) => ({
    time: new Date(item.timestamp).toLocaleDateString(),
    latency: item.latency,
  }));

  const endpointMap: Record<
    string,
    {
      calls: number;
      latency: number[];
      errors: number;
    }
  > = {};

  filteredHistory.forEach((item: any) => {
    const endpoint = item.url;

    if (!endpointMap[endpoint]) {
      endpointMap[endpoint] = {
        calls: 0,
        latency: [],
        errors: 0,
      };
    }

    endpointMap[endpoint].calls += 1;

    endpointMap[endpoint].latency.push(item.latency);

    if (item.status >= 400) {
      endpointMap[endpoint].errors += 1;
    }
  });

  const endpointTable = Object.entries(endpointMap).map(
    ([endpoint, value]) => ({
      endpoint,
      calls: value.calls,
      avgLatency: Math.round(
        value.latency.reduce((a, b) => a + b, 0) / value.latency.length,
      ),
      errors: value.errors,
    }),
  );

  const barChartData = endpointTable.map((item) => ({
    endpoint: item.endpoint.split("/").slice(-1)[0] || "api",
    latency: item.avgLatency,
  }));

  if (!history || history.length === 0) {
    return (
      <div className="p-6">
        <div className="border rounded-xl h-[300px] flex items-center justify-center text-gray-500 text-center px-4">
          No analytics data available yet. Start testing APIs in Sandbox.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Usage Analytics</h1>

          <p className="text-gray-500 text-sm md:text-base">
            Monitor API usage, latency, and error rates
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setRange("7")}
            className={`px-4 py-2 rounded-lg border text-sm ${
              range === "7" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Last 7 Days
          </button>

          <button
            onClick={() => setRange("30")}
            className={`px-4 py-2 rounded-lg border text-sm ${
              range === "30" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Total Requests
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{totalRequests}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Avg Latency</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{avgLatency} ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">4xx Errors</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{error4xx}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">5xx Errors</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{error5xx}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Success Rate
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{successRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Latency Trend</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="time" />

                  <YAxis />

                  <Tooltip />

                  <Line type="monotone" dataKey="latency" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endpoint Performance</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="endpoint" />

                  <YAxis />

                  <Tooltip formatter={(value) => [`${value} ms`, "Latency"]} />

                  <Bar dataKey="latency" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Per Endpoint Breakdown</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead>Avg Latency</TableHead>
                  <TableHead>Errors</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {endpointTable.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="max-w-[250px] break-all">
                      {item.endpoint}
                    </TableCell>

                    <TableCell>{item.calls}</TableCell>

                    <TableCell>{item.avgLatency} ms</TableCell>

                    <TableCell>{item.errors}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
