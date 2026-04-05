import { updateAvatar, updateProfile } from "@/services/profile/profileService";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UserProfile = {
  id: string;
  username: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (user: UserProfile) => {
      if (!userId) return;

      //update cache immediately
      queryClient.setQueryData(
        ["userProfile", userId],
        (prev: UserProfile | null) => ({
          ...prev,
          ...user,
        }),
      );

      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: updateAvatar,

    onSuccess: (avatarUrl: string) => {
      if (!userId) return;

      queryClient.setQueryData(
        ["userProfile", userId],
        (prev: UserProfile | null) => {
          if (!prev) return prev;

          return {
            ...prev,
            avatarUrl,
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["forYouFeed"] });
      queryClient.invalidateQueries({ queryKey: ["followingFeed"] });
    },
  });
}
