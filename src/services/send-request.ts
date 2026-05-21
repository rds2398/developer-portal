/* eslint-disable @typescript-eslint/no-explicit-any */
export async function sendRequest({
  url,
  selectedEndpoint,
  headers,
  body,
  getSessionToken,
}: {
  url: string;
  selectedEndpoint: any;
  headers: Record<string, string>;
  body: string;
  getSessionToken: () => Promise<string | undefined>;
}) {
  if (!url || !selectedEndpoint) return;

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
      parsedBody = body;
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

  return {
    status: res.status,
    latency: Math.round(end - start),
    data,
  };
}