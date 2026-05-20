import { useParams } from "react-router-dom";
import { useApiDocs } from "@/features/docs/use-api-docs";

export function ApiDocs() {
  const { apiId } = useParams();
  const data = useApiDocs(apiId!);

  if (!data) {
    return <div>API not found</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {data.api.name}
      </h1>

      <div className="mt-6 space-y-4">
        {data.endpoints.map((ep, idx) => (
          <div
            key={idx}
            className="border p-3 rounded"
          >
            <div className="text-sm text-gray-500">
              {ep.method.toUpperCase()}
            </div>

            <div className="font-mono">
              {ep.path}
            </div>

            {ep.summary && (
              <p className="text-sm">
                {ep.summary}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}