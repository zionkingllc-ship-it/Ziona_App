import { likePost, unlikePost } from "@/services/graphQL/mutation/actions";
import { usePostActionsStore } from "@/store/usePostActionStore";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

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
      return currentLiked
        ? unlikePost(postId)
        : likePost(postId);
    },

    onMutate: async ({ postId, currentLiked }) => {
      const next = !currentLiked;

      // defer Zustand update
      setTimeout(() => {
        toggleLikeStore(postId, next);
      }, 0);

      // optimistic cache update
      queryClient.setQueriesData(
        { queryKey: ["feed"], exact: false },
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((p: any) => {
                if (p.id !== postId) return p;

                return {
                  ...p,
                  viewerState: {
                    ...p.viewerState,
                    liked: next,
                  },
                  stats: {
                    ...p.stats,
                    likesCount: next
                      ? p.stats.likesCount + 1
                      : p.stats.likesCount - 1,
                  },
                };
              }),
            })),
          };
        }
      );

      return { postId, previous: currentLiked };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;

      // defer rollback too (IMPORTANT)
      setTimeout(() => {
        toggleLikeStore(ctx.postId, ctx.previous);
      }, 0);

      queryClient.setQueriesData(
        { queryKey: ["feed"], exact: false },
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((p: any) => {
                if (p.id !== ctx.postId) return p;

                return {
                  ...p,
                  viewerState: {
                    ...p.viewerState,
                    liked: ctx.previous,
                  },
                  stats: {
                    ...p.stats,
                    likesCount: ctx.previous
                      ? p.stats.likesCount + 1
                      : p.stats.likesCount - 1,
                  },
                };
              }),
            })),
          };
        }
      );
    },

    onSuccess: (data, { postId }) => {
      const newCount = data?.stats?.likesCount;

      if (typeof newCount !== "number") return;

      //  backend truth sync
      queryClient.setQueriesData(
        { queryKey: ["feed"], exact: false },
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((p: any) => {
                if (p.id !== postId) return p;

                return {
                  ...p,
                  stats: {
                    ...p.stats,
                    likesCount: newCount,
                  },
                };
              }),
            })),
          };
        }
      );
    },
  });
}