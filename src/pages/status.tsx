import { API_STATUS } from "@/lib/api-status";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatusPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">API Status</h1>

        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Monitor uptime and incident history for all APIs
        </p>
      </div>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {API_STATUS.map((api) => (
          <Card key={api.id}>
            <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg break-words">{api.name}</CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  90 Day Uptime: {api.uptime}%
                </p>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  api.status === "operational"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : api.status === "degraded"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      : "bg-destructive/15 text-destructive"
                }`}
              >
                {api.status}
              </div>
            </CardHeader>

            <CardContent>
              {api.incidents.length === 0 ? (
                <div className="text-sm text-muted-foreground">
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

                        <span className="text-xs text-muted-foreground">
                          {incident.date}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
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
