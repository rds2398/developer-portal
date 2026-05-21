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

        <p className="text-muted-foreground mt-1">Create and manage API access keys</p>
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
            className="w-full border border-input rounded-md p-2 bg-background text-foreground"
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
            className="w-full md:w-auto cursor-pointer"
          >
            Generate API Key
          </Button>
        </CardContent>
      </Card>

      {/* EMPTY STATE */}
      {keys.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
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

                  <div className="text-sm text-muted-foreground break-all">
                    {key.maskedKey}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-muted text-muted-foreground">
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
                  className="w-full md:w-auto cursor-pointer"
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
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Your API Key</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted text-foreground p-4 rounded-md break-all text-sm font-mono">
              {generatedKey}
            </div>

            <div className="text-sm text-amber-600 dark:text-amber-400">
              This key will only be shown once. Please copy and store it
              securely.
            </div>

            <Button onClick={copyKey} className="w-full cursor-pointer">
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

          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>

          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto cursor-pointer">Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (revokeId) {
                  revokeKey(revokeId);

                  toast.error("API Key Revoked");
                }
              }}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
