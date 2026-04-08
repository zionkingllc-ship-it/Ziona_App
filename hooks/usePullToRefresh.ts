import { useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function usePullToRefresh(queryKeys?: any[]) {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // 🔥 stabilize queryKeys reference
  const stableKeys = useMemo(() => queryKeys ?? [], [JSON.stringify(queryKeys)]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      if (stableKeys.length > 0) {
        await Promise.all(
          stableKeys.map((key) =>
            queryClient.invalidateQueries({ queryKey: key })
          )
        );
      } else {
        await queryClient.invalidateQueries();
      }
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, stableKeys]);

  return { refreshing, onRefresh };
}