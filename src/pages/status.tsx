import { API_STATUS } from "@/lib/api-status";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatusPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">API Status</h1>

        <p className="text-gray-500 mt-1 text-sm md:text-base">
          Monitor uptime and incident history for all APIs
        </p>
      </div>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {API_STATUS.map((api) => (
          <Card key={api.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">{api.name}</CardTitle>

                <p className="text-sm text-gray-500 mt-1">
                  90 Day Uptime: {api.uptime}%
                </p>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  api.status === "operational"
                    ? "bg-green-100 text-green-700"
                    : api.status === "degraded"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {api.status}
              </div>
            </CardHeader>

            <CardContent>
              {api.incidents.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No incidents reported.
                </div>
              ) : (
                <div className="space-y-4">
                  {api.incidents.map((incident, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="font-semibold text-sm md:text-base">
                          {incident.title}
                        </h3>

                        <span className="text-xs text-gray-500">
                          {incident.date}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {incident.resolution}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
