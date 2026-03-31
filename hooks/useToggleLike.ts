import { useMutation } from "@tanstack/react-query";
import { usePostActionsStore } from "@/store/usePostActionStore";

/* replace with your real API */
async function toggleLikeApi(postId: string, like: boolean) {
  try {
    // simulate request (replace later)
    await new Promise((res) => setTimeout(res, 300));

    return { success: true };
  } catch (e) {
    throw new Error("Failed");
  }
}

export function useToggleLike() {
  const toggleLikeStore = usePostActionsStore((s) => s.toggleLike);

  return useMutation({
    mutationFn: async ({
      postId,
      currentLiked,
    }: {
      postId: string;
      currentLiked: boolean;
    }) => {
      const next = !currentLiked;

      return toggleLikeApi(postId, next);
    },

    onMutate: async ({ postId, currentLiked }) => {
      //  optimistic update
      toggleLikeStore(postId, currentLiked);

      return { postId, previous: currentLiked };
    },

    onError: (err, variables, context) => {
      if (!context) return;

      //  rollback
      toggleLikeStore(context.postId, !context.previous);
    },

    onSuccess: () => {
      // optional: invalidate queries later
    },
  });
}