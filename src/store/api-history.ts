import { create } from "zustand";

type ApiHistory = {
  url: string;
  method: string;
  status?: number;
  latency?: number;
  timestamp: number;
};

type Store = {
  history: ApiHistory[];
  addHistory: (item: ApiHistory) => void;
};

export const useApiHistory = create<Store>((set) => ({
  history: [],
  addHistory: (newEntry) =>
  set((state) => {
    const exists = state.history.find(
      (item) => item.url === newEntry.url
    );

    if (exists) {
      return {
        history: state.history.map((item) =>
          item.url === newEntry.url
            ? { ...item, ...newEntry }
            : item
        ),
      };
    }

    return {
      history: [...state.history, newEntry],
    };
  }),
}));