/* eslint-disable @typescript-eslint/no-explicit-any */
export function generateCurl({
  url,
  method,
  headers,
  body,
}: {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
}) {
  let cmd = `curl -X ${method.toUpperCase()} "${url}"`;

  Object.entries(headers || {}).forEach(([k, v]) => {
    cmd += ` \\\n  -H "${k}: ${v}"`;
  });

  if (body) {
    cmd += ` \\\n  -d '${JSON.stringify(body)}'`;
  }

  return cmd;
}

export function generateFetch(url: string, method: string, body?: any) {
  return `
fetch("${url}", {
  method: "${method.toUpperCase()}",
  headers: {
    "Content-Type": "application/json"
  },
  body: ${body ? JSON.stringify(JSON.stringify(body)) : "undefined"}
})
.then(res => res.json())
.then(data => console.log(data));
`;
}

export function generatePython(url: string, method: string, body?: any) {
  return `
import requests

url = "${url}"

response = requests.request(
    method="${method.toUpperCase()}",
    url=url,
    json=${body ? JSON.stringify(body, null, 2) : "None"}
)

print(response.json())
`;
}