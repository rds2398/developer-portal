import React from "react";
import ReactDOM from "react-dom/client";

import { AppProviders } from "@/app/providers";

import "@/styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProviders />
    </QueryClientProvider>
  </React.StrictMode>,
);
