import { useQuery } from "@tanstack/react-query";
import { API_REGISTRY } from "@/api/api-registry";

function getApiDocs(apiId: string) {
  const api = API_REGISTRY.find((a) => a.id === apiId);

  if (!api) throw new Error("API not found");

  return {
    api,
    endpoints: Object.keys(api.spec.paths || {}).map((path) => ({
      path,
      method: "get",
      summary: "",
    })),
  };
}

export function useApiDocs(apiId?: string) {
  return useQuery({
    queryKey: ["api-docs", apiId],
    queryFn: () => getApiDocs(apiId!),
    enabled: !!apiId,
  });
}