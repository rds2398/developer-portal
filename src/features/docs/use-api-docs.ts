import { useMemo } from "react";
import { API_REGISTRY } from "@/api/api-registry";
import { parseOpenAPISpec } from "@/lib/spec-parser";

export function useApiDocs(apiId: string) {
  return useMemo(() => {
    const api = API_REGISTRY.find((a) => a.id === apiId);

    if (!api) return null;

    const parsed = parseOpenAPISpec(api.spec);

    return {
      api,
      endpoints: parsed.endpoints,
    };
  }, [apiId]);
}