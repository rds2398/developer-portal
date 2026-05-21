import { create } from "zustand";

export type ApiKey = {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  environment: "sandbox" | "production";
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
};

type ApiKeyStore = {
  keys: ApiKey[];

  addKey: (
    data: Omit<ApiKey, "id" | "maskedKey" | "createdAt">
  ) => void;

  revokeKey: (id: string) => void;
};

function maskKey(key: string) {
  return `••••••••${key.slice(-4)}`;
}

export const useApiKeyStore = create<ApiKeyStore>((set) => ({
  keys: [],

  addKey: (data) =>
    set((state) => {
      const newKey: ApiKey = {
        ...data,
        id: crypto.randomUUID(),
        maskedKey: maskKey(data.key),
        createdAt: new Date().toISOString(),
      };

      return {
        keys: [newKey, ...state.keys],
      };
    }),

  revokeKey: (id) =>
    set((state) => ({
      keys: state.keys.filter((k) => k.id !== id),
    })),
}));