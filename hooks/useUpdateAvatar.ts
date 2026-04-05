import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAvatar } from "@/services/graphQL/profile/profile";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatar,

    onSuccess: (avatarUrl) => {
      queryClient.setQueryData(["userProfile"], (prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          avatarUrl,
        };
      });
    },
  });
}