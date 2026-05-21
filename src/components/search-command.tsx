import { useEffect, useMemo, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { API_REGISTRY } from "@/api/api-registry";
import { extractEndpoints } from "@/lib/endpoint-utils";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  const items = useMemo(() => {
    return API_REGISTRY.flatMap((api) => {
      const endpoints = extractEndpoints(api.spec);

      return endpoints.map((ep) => ({
        apiId: api.id,
        title: `${ep.method} ${ep.path}`,
        description: ep.summary || "",
      }));
    });
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Search"
      className="fixed top-20 left-1/2 -translate-x-1/2 w-[600px]  border rounded-lg shadow-lg p-4 z-50"
    >
      <Command.Input
        placeholder="Search endpoints..."
        className="w-full border p-2 rounded"
      />

      <Command.List className="mt-4 max-h-96 overflow-auto">
        <Command.Empty>No results found.</Command.Empty>

        {items.map((item, index) => (
          <Command.Item
            key={index}
            value={`${item.title} ${item.description}`}
            onSelect={() => {
              navigate(`/api/${item.apiId}`);
              setOpen(false);
            }}
            className="p-2 rounded hover:bg-gray-600 cursor-pointer"
          >
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-gray-500">{item.description}</div>
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
