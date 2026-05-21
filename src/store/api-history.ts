/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ApiHistory = {
  url: string;
  method: string;
  status?: number;
  latency?: number;
  timestamp: number;
  headers?: Record<string, string>;
  body?: string;
  endpoint?: any;
  pathValues?: Record<string, string>;
  queryValues?: Record<string, string>;
  response?: any;
};

type Store = {
  history: ApiHistory[];

  addHistory: (item: ApiHistory) => void;

  clearHistory: () => void;
};

export const useApiHistory = create<Store>()(
  persist(
    (set) => ({
      history: [],

      addHistory: (newEntry) =>
        set((state) => {
          const exists = state.history.find(
            (item) =>
              item.url === newEntry.url &&
              item.method === newEntry.method,
          );

          // UPDATE EXISTING
          if (exists) {
            return {
              history: state.history.map((item) =>
                item.url === newEntry.url &&
                item.method === newEntry.method
                  ? {
                      ...item,
                      ...newEntry,
                    }
                  : item,
              ),
            };
          }

          // ADD NEW
          return {
            history: [newEntry, ...state.history],
          };
        }),

      clearHistory: () =>
        set({
          history: [],
        }),
    }),
    {
      name: "api-history-storage",
    },
  ),
);