import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: attempt =>
        Math.min(1000 * 2 ** attempt, 30000),
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});
