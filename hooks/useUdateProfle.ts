

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/graphQL/profile/profile";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (user) => {
      //update cached profile
      queryClient.setQueryData(["userProfile"], user);
    },
  });
}