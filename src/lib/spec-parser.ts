/* eslint-disable @typescript-eslint/no-explicit-any */
type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export interface ParsedEndpoint {
  method: HttpMethod;
  path: string;
  summary?: string;
  parameters?: any[];
}

export interface ParsedApiSpec {
  endpoints: ParsedEndpoint[];
}

export function parseOpenAPISpec(spec: any): ParsedApiSpec {
  const endpoints: ParsedEndpoint[] = [];

  if (!spec?.paths) return { endpoints };

  Object.entries(spec.paths).forEach(([path, methods]: any) => {
    Object.entries(methods).forEach(([method, config]: any) => {
      const m = method.toLowerCase();

      if (
        !["get", "post", "put", "delete", "patch"].includes(m)
      )
        return;

      endpoints.push({
        method: m as HttpMethod,
        path,
        summary: config?.summary,
        parameters: config?.parameters || [],
      });
    });
  });

  return { endpoints };
}