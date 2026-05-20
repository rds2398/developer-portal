/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Endpoint {
  method: string;
  path: string;
  summary?: string;
  pathParams: string[];
  queryParams: string[];
}

export function extractEndpoints(spec: any): Endpoint[] {
  const endpoints: Endpoint[] = [];

  if (!spec?.paths) return endpoints;

  Object.entries(spec.paths).forEach(([path, methods]: any) => {
    Object.entries(methods).forEach(([method, config]: any) => {
      const pathParams: string[] = [];
      const queryParams: string[] = [];

      (config?.parameters || []).forEach((p: any) => {
        if (p.in === "path") pathParams.push(p.name);
        if (p.in === "query") queryParams.push(p.name);
      });

      endpoints.push({
        method: method.toUpperCase(),
        path,
        summary: config?.summary,
        pathParams,
        queryParams,
      });
    });
  });

  return endpoints;
}