/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_REGISTRY } from "@/api/api-registry";
import { Chart } from "@/components/ui/chart";
import { useApiHistory } from "@/store/api-history";
import { Link } from "react-router-dom";

export function Dashboard() {
  const totalApis = API_REGISTRY.length;
   const history = useApiHistory((state) => state.history);
   console.log(history)
  const totalEndpoints = API_REGISTRY.reduce((acc, api) => {
    return acc + (api.spec?.paths ? Object.keys(api.spec.paths).length : 0);
  }, 0);


  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Developer Dashboard
        </h1>
        <p className="text-gray-500">
          Manage and test your APIs in one place
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="p-4 border rounded-lg">
          <h2 className="text-sm text-gray-500">Total APIs</h2>
          <p className="text-2xl font-bold">{totalApis}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-sm text-gray-500">Total Endpoints</h2>
          <p className="text-2xl font-bold">{totalEndpoints}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-sm text-gray-500">Sandbox</h2>
          <Link
            to="/sandbox"
            className="text-blue-600 font-medium"
          >
            Open Sandbox →
          </Link>
        </div>

      </div>

      {/* API CARDS */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Available APIs
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {API_REGISTRY.map((api) => (
            <Link
              key={api.id}
              to={`/api/${api.id}`}
              className="p-4 border rounded-lg hover:shadow-md transition"
            >
              <h3 className="font-bold">{api.name}</h3>
              <p className="text-sm text-gray-500">
                Version: {api.version}
              </p>
              <p className="text-sm text-gray-500">
                Base URL: {api.baseUrl}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Chart */}

      <Chart data={history}/>

    </div>
  );
}