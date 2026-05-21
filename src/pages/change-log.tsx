import { useMemo, useState } from "react";

import { CHANGELOGS } from "@/lib/change-log";

export function ChangelogPage() {
  const [selectedApi, setSelectedApi] = useState("all");

  const [selectedType, setSelectedType] = useState("all");

  const filteredLogs = useMemo(() => {
    return CHANGELOGS.filter((log) => {
      const apiMatch = selectedApi === "all" || log.api === selectedApi;

      const typeMatch = selectedType === "all" || log.type === selectedType;

      return apiMatch && typeMatch;
    });
  }, [selectedApi, selectedType]);

  function getBadgeColor(type: string) {
    if (type === "breaking") {
      return "bg-red-100 text-red-700";
    }

    if (type === "feature") {
      return "bg-green-100 text-green-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">API Changelog</h1>

        <p className="text-gray-500 mt-1 text-sm md:text-base">
          Track API releases, fixes and breaking changes
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={selectedApi}
          onChange={(e) => setSelectedApi(e.target.value)}
          className="border rounded-lg p-2 w-full md:w-56"
        >
          <option value="all">All APIs</option>

          <option value="PokéAPI">PokéAPI</option>

          <option value="DummyJSON">DummyJSON</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded-lg p-2 w-full md:w-56"
        >
          <option value="all">All Types</option>

          <option value="breaking">Breaking</option>

          <option value="feature">Feature</option>

          <option value="fix">Fix</option>
        </select>
      </div>

      {/* EMPTY STATE */}
      {filteredLogs.length === 0 && (
        <div className="border rounded-lg p-8 text-center text-gray-500">
          No changelog entries found
        </div>
      )}

      {/* CHANGELOG LIST */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div key={log.id} className="border rounded-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{log.api}</span>

                  <span className="text-sm text-gray-500">{log.version}</span>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getBadgeColor(
                      log.type,
                    )}`}
                  >
                    {log.type}
                  </span>
                </div>

                <h2 className="text-lg font-bold break-words">{log.title}</h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {log.description}
                </p>
              </div>

              <div className="text-sm text-gray-500 whitespace-nowrap">
                {log.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
