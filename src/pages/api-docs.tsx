/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useApiDocs } from "@/features/docs/use-api-docs";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiMarkdown } from "@/components/api-markdown";
import { ErrorCatalogue } from "@/components/error-catalogue";

export function ApiDocs() {
  const { apiId } = useParams();

  const { data, isLoading, isError } = useApiDocs(apiId);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
        <div className="space-y-2">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex gap-2 items-center">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-5 w-52" />
              </div>

              <Skeleton className="h-4 w-full" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />

                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-10 w-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <div className="border border-red-300 bg-red-50 text-red-600 rounded-lg p-4">
          Failed to load API documentation
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 md:p-6">
        <div className="border rounded-lg p-6 text-gray-500 text-center">
          API not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 overflow-x-hidden">
      {/* API HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold break-words">
          {data.api.name}
        </h1>

        <p className="text-gray-500 mt-1">
          Version: {data.api.version}
        </p>
      </div>

      {/* MARKDOWN DOCS */}
      {data.api.docsFile && (
        <div className="border rounded-lg p-4 md:p-6 overflow-hidden">
          <ApiMarkdown file={data.api.docsFile} />
        </div>
      )}

      {/* SDK LINKS */}
      {data.api.sdkLinks && data.api.sdkLinks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold">
            SDKs & Libraries
          </h2>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {data.api.sdkLinks.map((sdk, idx) => (
              <a
                key={idx}
                href={sdk.url}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2 border rounded-lg hover:bg-gray-600 transition text-center break-all"
              >
                {sdk.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ENDPOINTS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          Endpoints
        </h2>

        {data.endpoints.map((ep, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-4 md:p-6 space-y-5 overflow-hidden"
          >
            {/* METHOD + PATH */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 break-all">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs uppercase w-fit">
                {ep.method}
              </span>

              <code className="font-mono text-xs sm:text-sm break-all overflow-x-auto">
                {ep.path}
              </code>
            </div>

            {/* SUMMARY */}
            {ep.summary && (
              <p className="text-gray-600 break-words">
                {ep.summary}
              </p>
            )}

            {/* PARAMETERS */}
            {ep.parameters && ep.parameters.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">
                  Parameters
                </h3>

                <div className="w-full overflow-x-auto rounded-lg">
                  <table className="min-w-[700px] w-full border text-sm">
                    <thead className="bg-gray-600">
                      <tr>
                        <th className="border p-2 text-left">
                          Name
                        </th>

                        <th className="border p-2 text-left">
                          Type
                        </th>

                        <th className="border p-2 text-left">
                          Required
                        </th>

                        <th className="border p-2 text-left">
                          Description
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {ep.parameters.map(
                        (param: any, paramIdx: number) => (
                          <tr key={paramIdx}>
                            <td className="border p-2 break-all">
                              {param.name}
                            </td>

                            <td className="border p-2">
                              {param.schema?.type || "-"}
                            </td>

                            <td className="border p-2">
                              {param.required ? "Yes" : "No"}
                            </td>

                            <td className="border p-2 break-words">
                              {param.description || "-"}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REQUEST BODY */}
            {ep.requestBody && (
              <div className="space-y-3">
                <h3 className="font-semibold">
                  Request Body
                </h3>

                <pre className="bg-black text-white p-3 md:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                  {JSON.stringify(ep.requestBody, null, 2)}
                </pre>
              </div>
            )}

            {/* RESPONSES */}
            {ep.responses && (
              <div className="space-y-3">
                <h3 className="font-semibold">
                  Responses
                </h3>

                <div className="space-y-3">
                  {Object.entries(ep.responses).map(
                    ([code, response]: any) => (
                      <div
                        key={code}
                        className="border rounded-lg p-4 overflow-hidden"
                      >
                        <div className="font-bold mb-2">
                          Status: {code}
                        </div>

                        <pre className="overflow-x-auto text-xs sm:text-sm bg-gray-600 p-3 rounded">
                          {JSON.stringify(response, null, 2)}
                        </pre>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ERROR CATALOGUE */}
      <ErrorCatalogue />
    </div>
  );
}