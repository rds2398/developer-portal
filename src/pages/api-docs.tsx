import { useParams } from "react-router-dom";
import { useApiDocs } from "@/features/docs/use-api-docs";
import { Skeleton } from "@/components/ui/skeleton";

export function ApiDocs() {
  const { apiId } = useParams();
  const { data, isLoading, isError } = useApiDocs(apiId);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />

        <div className="space-y-3 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border p-3 rounded space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load API documentation
      </div>
    );
  }

 
  if (!data) {
    return (
      <div className="p-6 text-gray-500">
        API not found
      </div>
    );
  }

  // 🔥 SUCCESS STATE
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{data.api.name}</h1>

      <div className="mt-6 space-y-4">
        {data?.endpoints?.map((ep, idx) => (
          <div key={idx} className="border p-3 rounded">
            <div className="text-sm text-gray-500">
              {ep.method.toUpperCase()}
            </div>

            <div className="font-mono">{ep.path}</div>

            {ep.summary && (
              <p className="text-sm">{ep.summary}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}