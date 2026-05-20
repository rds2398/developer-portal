/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { API_REGISTRY } from "@/api/api-registry";
import { extractEndpoints } from "@/lib/endpoint-utils";
import type { Endpoint } from "@/lib/endpoint-utils";
import { supabase } from "@/lib/supabase";
import {
  generateCurl,
  generateFetch,
  generatePython,
} from "@/lib/snippet-generator";

export function Sandbox() {
  const [session, setSession] = useState<any>(null);

  const [selectedApi, setSelectedApi] = useState("pokeapi");
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null,
  );

  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState<string>("");

  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});

  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const api = API_REGISTRY.find((a) => a.id === selectedApi)!;
  const [snippetType, setSnippetType] = useState<"curl" | "fetch" | "python">(
    "curl",
  );
  const endpoints = useMemo(() => {
    return extractEndpoints(api.spec);
  }, [api]);

  async function getSessionToken() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    setSession(data.session);
    return token;
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

  async function sendRequest() {
    const url = buildUrl();
    if (!url || !selectedEndpoint) return;

    try {
      setLoading(true);

      const token = await getSessionToken();

      const finalHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
      };

      if (token) {
        finalHeaders["Authorization"] = `Bearer ${token}`;
      }

      let parsedBody: any = undefined;

      if (selectedEndpoint.method !== "GET" && body?.trim()) {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          parsedBody = body; // fallback raw string
        }
      }

      const start = performance.now();

      const res = await fetch(url, {
        method: selectedEndpoint.method,
        headers: finalHeaders,
        body: parsedBody ? JSON.stringify(parsedBody) : undefined,
      });

      const data = await res.json();

      const end = performance.now();

      setResponse({
        status: res.status,
        latency: Math.round(end - start),
        data,
      });
    } catch (err) {
      setResponse({
        error: "Request failed",
        details: String(err),
      });
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">API Sandbox</h1>

      {/* API Selector */}
      <select
        value={selectedApi}
        onChange={(e) => setSelectedApi(e.target.value)}
        className="border p-2"
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
            className="p-2 border cursor-pointer"
          >
            <div className="font-bold">
              {ep.method} {ep.path}
            </div>
            {ep.summary && (
              <div className="text-sm text-gray-500">{ep.summary}</div>
            )}
          </div>
        ))}
      </div>

      {/* Path Params */}
      {selectedEndpoint?.pathParams.map((param) => (
        <input
          key={param}
          placeholder={`path: ${param}`}
          className="border p-2 block"
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
          className="border p-2 block"
          onChange={(e) =>
            setQueryValues({
              ...queryValues,
              [param]: e.target.value,
            })
          }
        />
      ))}

      {/* Headers UI FIX (now proper merging instead of overwrite bug) */}
      <div className="space-y-2">
        <h3 className="font-bold">Headers</h3>

        <input
          placeholder="Header Key"
          className="border p-2 mr-2"
          onChange={(e) =>
            setHeaders((prev) => ({
              ...prev,
              key: e.target.value,
            }))
          }
        />

        <input
          placeholder="Header Value"
          className="border p-2"
          onChange={(e) =>
            setHeaders((prev) => ({
              ...prev,
              value: e.target.value,
            }))
          }
        />
      </div>

      {/* Body */}
      {selectedEndpoint?.method !== "GET" && (
        <textarea
          placeholder='{"key":"value"}'
          className="border p-2 w-full h-28 font-mono"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}

      {/* Send Button */}
      <button
        onClick={sendRequest}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Send Request
      </button>

      {/* Response */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Response</h3>

        <pre className="bg-black text-white p-4 rounded-md overflow-auto max-h-96">
          {loading ? "Loading..." : JSON.stringify(response, null, 2)}
        </pre>
      </div>

      {/* SNIPPET CONTROLS */}
      <div className="mt-6 space-y-2">
        <h3 className="font-bold">Code Snippet</h3>

        <select
          value={snippetType}
          onChange={(e) => setSnippetType(e.target.value as any)}
          className="border p-2"
        >
          <option value="curl">cURL</option>
          <option value="fetch">JavaScript</option>
          <option value="python">Python</option>
        </select>

        <pre className="bg-gray-900 text-white p-4 overflow-auto">
          {snippet}
        </pre>
      </div>
    </div>
  );
}
