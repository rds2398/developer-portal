/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { API_REGISTRY } from "@/api/api-registry";
import { extractEndpoints } from "@/lib/endpoint-utils";
import type { Endpoint } from "@/lib/endpoint-utils";
import { supabase } from "@/lib/supabase";
import {
  generateCurl,
  generateFetch,
  generatePython,
} from "@/lib/snippet-generator";
import { useMutation } from "@tanstack/react-query";
import { sendRequest } from "@/services/send-request";
import { toast } from "sonner";
import { useApiHistory } from "@/store/api-history";
export function Sandbox() {
  const { addHistory } = useApiHistory.getState();
  const history = useApiHistory((state) => state.history);
  const [selectedApi, setSelectedApi] = useState("pokeapi");
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null,
  );

  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState<string>("");

  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});

  const api = API_REGISTRY.find((a) => a.id === selectedApi)!;

  const [snippetType, setSnippetType] = useState<"curl" | "fetch" | "python">(
    "curl",
  );

  const endpoints = useMemo(() => {
    return extractEndpoints(api.spec);
  }, [api]);

  const RATE_LIMIT = 20;

  const WINDOW_SECONDS = 60;

  const [rateUsed, setRateUsed] = useState(0);

  const [resetCountdown, setResetCountdown] = useState(WINDOW_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setResetCountdown((prev) => {
        if (prev <= 1) {
          setRateUsed(0);

          return WINDOW_SECONDS;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function getSessionToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  }

  function buildUrl() {
    if (!selectedEndpoint) return "";

    let url = `${api.baseUrl}${selectedEndpoint.path}`;

    Object.entries(pathValues).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });

    const query = new URLSearchParams(queryValues).toString();
    if (query) url += `?${query}`;

    return url;
  }

  const requestMutation = useMutation({
    mutationFn: async () => {
      return sendRequest({
        url: buildUrl(),
        selectedEndpoint,
        headers,
        body,
        getSessionToken,
      });
    },
    onSuccess: (response) => {
      addHistory({
        url: buildUrl(),
        method: selectedEndpoint?.method || "GET",
        status: response?.status,
        latency: response?.latency,
        timestamp: Date.now(),

        headers,
        body,

        endpoint: selectedEndpoint,
        pathValues,
        queryValues,

        response,
      });
      setRateUsed((prev) => {
        if (prev >= RATE_LIMIT) return RATE_LIMIT;

        return prev + 1;
      });
    },
  });

  const url = buildUrl();

  const snippet = useMemo(() => {
    if (!selectedEndpoint || !url) return "";

    if (snippetType === "curl") {
      return generateCurl({
        url,
        method: selectedEndpoint.method,
        headers,
        body: body ? JSON.parse(body || "{}") : undefined,
      });
    }

    if (snippetType === "fetch") {
      return generateFetch(
        url,
        selectedEndpoint.method,
        body ? JSON.parse(body || "{}") : undefined,
      );
    }

    return generatePython(
      url,
      selectedEndpoint.method,
      body ? JSON.parse(body || "{}") : undefined,
    );
  }, [snippetType, selectedEndpoint, url, headers, body]);

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);

    toast.success(label);
  }

  function replayRequest(item: any) {
    setSelectedEndpoint(item.endpoint);

    setHeaders(item.headers || {});

    setBody(item.body || "");

    setPathValues(item.pathValues || {});

    setQueryValues(item.queryValues || {});

    toast.success("Request restored");
  }

  function exportHAR() {
    const history = useApiHistory.getState().history || [];

    const har = {
      log: {
        version: "1.2",
        creator: {
          name: "Developer Portal",
          version: "1.0",
        },

        entries: history.map((item: any) => ({
          startedDateTime: new Date(item.timestamp).toISOString(),

          time: item.latency,

          request: {
            method: item.method,
            url: item.url,

            headers: Object.entries(item.headers || {}).map(
              ([name, value]) => ({
                name,
                value,
              }),
            ),

            postData: {
              mimeType: "application/json",
              text: item.body || "",
            },
          },

          response: {
            status: item.status,

            content: {
              mimeType: "application/json",

              text: JSON.stringify(item.response || {}),
            },
          },
        })),
      },
    };

    const blob = new Blob([JSON.stringify(har, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "sandbox.har";

    a.click();

    URL.revokeObjectURL(url);

    toast.success("HAR exported");
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">API Sandbox</h1>

      {/* API Selector */}
      <select
        value={selectedApi}
        onChange={(e) => setSelectedApi(e.target.value)}
        className="w-full max-w-full border border-input rounded-lg p-2.5 bg-background text-foreground cursor-pointer text-sm sm:text-base"
      >
        {API_REGISTRY.map((api) => (
          <option key={api.id} value={api.id}>
            {api.name}
          </option>
        ))}
      </select>

      {/* Endpoint List */}
      <div className="space-y-2">
        {endpoints.map((ep, i) => (
          <div
            key={i}
            onClick={() => {
              setSelectedEndpoint(ep);
              setPathValues({});
              setQueryValues({});
              setBody("");
            }}
            className="p-3 sm:p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="font-bold text-sm sm:text-base break-all">
              {ep.method} {ep.path}
            </div>
            {ep.summary && (
              <div className="text-sm text-muted-foreground">{ep.summary}</div>
            )}
          </div>
        ))}
      </div>

      {/* Path Params */}
      {selectedEndpoint?.pathParams.map((param) => (
        <input
          key={param}
          placeholder={`path: ${param}`}
          className="w-full border border-input rounded-lg p-2.5 bg-background text-foreground text-sm sm:text-base block"
          onChange={(e) =>
            setPathValues({
              ...pathValues,
              [param]: e.target.value,
            })
          }
        />
      ))}

      {/* Query Params */}
      {selectedEndpoint?.queryParams.map((param) => (
        <input
          key={param}
          placeholder={`query: ${param}`}
          className="w-full border border-input rounded-lg p-2.5 bg-background text-foreground text-sm sm:text-base block"
          onChange={(e) =>
            setQueryValues({
              ...queryValues,
              [param]: e.target.value,
            })
          }
        />
      ))}

      {/* Headers */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm sm:text-base">Headers</h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            placeholder="Header Key"
            className="w-full border border-input rounded-lg p-2.5 bg-background text-foreground text-sm sm:text-base"
            onChange={(e) =>
              setHeaders((prev) => ({
                ...prev,
                key: e.target.value,
              }))
            }
          />

          <input
            placeholder="Header Value"
            className="w-full border border-input rounded-lg p-2.5 bg-background text-foreground text-sm sm:text-base"
            onChange={(e) =>
              setHeaders((prev) => ({
                ...prev,
                value: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* Body */}
      {selectedEndpoint?.method !== "GET" && (
        <textarea
          placeholder='{"key":"value"}'
          className="border border-input rounded-lg p-2.5 w-full min-h-28 h-28 sm:h-32 font-mono text-xs sm:text-sm bg-background text-foreground"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}

      <button
        onClick={() => requestMutation?.mutate()}
        disabled={requestMutation?.isPending}
        className="w-full sm:w-auto bg-primary text-primary-foreground px-4 py-2.5 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors text-sm sm:text-base"
      >
        {requestMutation.isPending ? "Sending..." : "Send Request"}
      </button>

      {/* Response */}
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h3 className="font-bold text-sm sm:text-base">Response</h3>

          <button
            onClick={() =>
              copyToClipboard(
                JSON.stringify(requestMutation.data, null, 2),
                "Response copied to clipboard",
              )
            }
            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded cursor-pointer hover:bg-secondary/80 transition-colors"
          >
            Copy Response
          </button>
        </div>

        <pre className="bg-muted text-foreground p-3 sm:p-4 rounded-lg overflow-x-auto max-h-64 sm:max-h-96 font-mono text-xs sm:text-sm">
          {requestMutation.isPending
            ? "Loading..."
            : requestMutation.data
              ? JSON.stringify(requestMutation.data, null, 2)
              : "No response yet"}
        </pre>
      </div>

      {/* RATE LIMIT VISUALISER */}
      <div className="mt-4 sm:mt-6 border border-border rounded-lg p-3 sm:p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="font-bold text-base sm:text-lg">Rate Limit Usage</h3>

          <div className="text-sm text-muted-foreground">
            Resets in {resetCountdown}s
          </div>
        </div>

        {/* Progress */}
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${(rateUsed / RATE_LIMIT) * 100}%`,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {rateUsed} / {RATE_LIMIT} requests used
          </span>

          <span>{Math.max(RATE_LIMIT - rateUsed, 0)} remaining</span>
        </div>
      </div>

      {/* REQUEST HISTORY */}
      <div className="mt-4 sm:mt-6 border border-border rounded-lg p-3 sm:p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-bold text-base sm:text-lg">Sandbox Request Log</h3>

          <button
            onClick={exportHAR}
            className="w-full sm:w-auto bg-secondary text-secondary-foreground px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
          >
            Export HAR
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-sm text-muted-foreground">No requests yet</div>
        ) : (
          <div className="space-y-3">
            {history.map((item: any, idx: number) => (
              <div
                key={idx}
                className="
            border
            rounded-lg
            p-4
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-4
          "
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                      {item.method}
                    </span>

                    <span className="font-mono text-sm break-all">
                      {item.url}
                    </span>
                  </div>

                  <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                    <span>Status: {item.status}</span>

                    <span>{item.latency} ms</span>

                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => replayRequest(item)}
                  className="bg-primary text-primary-foreground px-3 py-2 rounded text-sm w-full lg:w-auto cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  Replay
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SNIPPET */}
      <div className="mt-6 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="font-bold text-sm sm:text-base">Code Snippet</h3>

          <button
            onClick={() => copyToClipboard(snippet, "cURL copied!")}
            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded cursor-pointer hover:bg-secondary/80 transition-colors"
          >
            Copy cURL
          </button>
        </div>

        <select
          value={snippetType}
          onChange={(e) => setSnippetType(e.target.value as any)}
          className="w-full sm:w-auto border border-input rounded-lg p-2.5 bg-background text-foreground text-sm sm:text-base"
        >
          <option value="curl">cURL</option>
          <option value="fetch">JavaScript</option>
          <option value="python">Python</option>
        </select>

        <pre className="bg-muted text-foreground p-3 sm:p-4 overflow-x-auto font-mono text-xs sm:text-sm rounded-lg max-w-full">
          {snippet}
        </pre>
      </div>
    </div>
  );
}
