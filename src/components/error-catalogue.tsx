import { ERROR_CATALOGUE } from "@/lib/error-catalogue";

export function ErrorCatalogue() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Error Catalogue
      </h2>

      <div className="overflow-x-auto -mx-1 px-1 rounded-lg">
        <table className="w-full min-w-[640px] border border-border text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="border p-2 text-left">
                Code
              </th>

              <th className="border p-2 text-left">
                Description
              </th>

              <th className="border p-2 text-left">
                Cause
              </th>

              <th className="border p-2 text-left">
                Resolution
              </th>
            </tr>
          </thead>

          <tbody>
            {ERROR_CATALOGUE.map((error) => (
              <tr key={error.code}>
                <td className="border p-2">
                  {error.code}
                </td>

                <td className="border p-2">
                  {error.description}
                </td>

                <td className="border p-2">
                  {error.cause}
                </td>

                <td className="border p-2">
                  {error.resolution}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}