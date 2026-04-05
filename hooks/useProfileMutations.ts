import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  updateAvatar,
} from "@/services/profile/profileService";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(["userProfile", "me"], user);
    },
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: (avatarUrl) => {
      queryClient.setQueryData(["userProfile", "me"], (prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          avatarUrl,
        };
      });
    },
  });
}