import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@/services/graphQL/graphqlClient";
import { useAuthStore } from "@/store/useAuthStore";


type BioResponse = {
  id: string;
  bio?: string;
};


export function useUpdateBio() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id); 
  return useMutation({
    mutationFn: async (bio: string) => {
      const data = await graphqlRequest(
        `
        mutation UpdateProfile($bio: String!) {
          updateProfile(bio: $bio) {
            success
            user { id bio }
          }
        }
      `,
        { bio }
      );

      return data?.updateProfile?.user as BioResponse;
    },

    onSuccess: (updatedUser) => {
      if (!userId) return;

      queryClient.setQueryData(
        ["userProfile", userId],
        (old: any) => ({
          ...old,
          bio: updatedUser?.bio,
        })
      );

      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });
}