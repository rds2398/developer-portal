import { ERROR_CATALOGUE } from "@/lib/error-catalogue";

export function ErrorCatalogue() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Error Catalogue
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
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