import { useState } from "react";
import { useApiKeyStore } from "@/store/api-key-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

function generateApiKey() {
  return `sk_${crypto.randomUUID().replace(/-/g, "")}`;
}

export function ApiKeys() {
  const { keys, addKey, revokeKey } = useApiKeyStore();

  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState<"sandbox" | "production">(
    "sandbox",
  );

  const [expiry, setExpiry] = useState("");

  const [generatedKey, setGeneratedKey] = useState("");

  const [open, setOpen] = useState(false);

  const [revokeId, setRevokeId] = useState<string | null>(null);

  function handleCreateKey() {
    const key = generateApiKey();

    addKey({
      name,
      key,
      environment,
      expiresAt: expiry || undefined,
      lastUsed: "-",
    });

    setGeneratedKey(key);

    setOpen(true);

    setName("");
    setExpiry("");

    toast.success("API key created");
  }

  function copyKey() {
    navigator.clipboard.writeText(generatedKey);

    toast.success("API Key copied");
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">API Key Management</h1>

        <p className="text-gray-500 mt-1">Create and manage API access keys</p>
      </div>

      {/* CREATE FORM */}
      <Card>
        <CardHeader>
          <CardTitle>Create API Key</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Key Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            value={environment}
            onChange={(e) =>
              setEnvironment(e.target.value as "sandbox" | "production")
            }
            className="w-full border rounded-md p-2 bg-background"
          >
            <option value="sandbox">Sandbox</option>
            <option value="production">Production</option>
          </select>

          <Input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />

          <Button
            onClick={handleCreateKey}
            disabled={!name}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 cursor-pointer "
          >
            Generate API Key
          </Button>
        </CardContent>
      </Card>

      {/* EMPTY STATE */}
      {keys.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No API keys created yet
          </CardContent>
        </Card>
      )}

      {/* API KEY LIST */}
      {keys.length > 0 && (
        <div className="grid gap-4">
          {keys.map((key) => (
            <Card key={key.id}>
              <CardContent className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1 min-w-0">
                  <div className="font-semibold break-all">{key.name}</div>

                  <div className="text-sm text-gray-500 break-all">
                    {key.maskedKey}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-gray-200">
                      {key.environment}
                    </span>

                    <span>
                      Created: {new Date(key.createdAt).toLocaleDateString()}
                    </span>

                    <span>Last Used: {key.lastUsed}</span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => setRevokeId(key.id)}
                  className="w-full md:w-auto bg-red-500 cursor-pointer hover:bg-red-600"
                >
                  Revoke
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* SHOW FULL KEY ONCE */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Your API Key</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-black text-white p-4 rounded-md break-all text-sm">
              {generatedKey}
            </div>

            <div className="text-sm text-yellow-600">
              This key will only be shown once. Please copy and store it
              securely.
            </div>

            <Button onClick={copyKey} className="w-full bg-blue-600 cursor-pointer">
              Copy API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* REVOKE CONFIRMATION */}
      <AlertDialog open={!!revokeId} onOpenChange={() => setRevokeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
          </AlertDialogHeader>

          <p className="text-sm text-gray-500">This action cannot be undone.</p>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-600 cursor-pointer">Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (revokeId) {
                  revokeKey(revokeId);

                  toast.error("API Key Revoked");
                }
              }}
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
