import { queryClient } from "@/lib/queryClient";
import { likePost, unlikePost } from "@/services/graphQL/mutation/actions";
import { usePostActionsStore } from "@/store/usePostActionStore";
import { useMutation } from "@tanstack/react-query";

const FEED_KEYS = [
  ["forYouFeed"],
  ["followingFeed"],
  ["userPosts"],
  ["likedPosts"],
];

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
      return currentLiked ? unlikePost(postId) : likePost(postId);
    },

    onMutate: async ({ postId, currentLiked }) => {
      const next = !currentLiked;

      // Zustand optimistic
      setTimeout(() => {
        toggleLikeStore(postId, next);
      }, 0);

      // cache optimistic
      const updater = (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages?.map((page: any) => ({
            ...page,
            posts: page.posts?.map((p: any) => {
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
                    ? (p.stats?.likesCount ?? 0) + 1
                    : (p.stats?.likesCount ?? 0) - 1,
                },
              };
            }),
          })),
        };
      };
      FEED_KEYS.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      FEED_KEYS.forEach((key) => {
        queryClient.setQueriesData({ queryKey: key, exact: false }, updater);
      });

      queryClient.setQueriesData(
        { queryKey: ["likedPosts"], exact: false },
        (oldData: any) => {
          if (!oldData) return oldData;

          // OPTIONAL: inject/remove post
          return oldData;
        },
      );

      return { postId, previous: currentLiked };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;

      // rollback Zustand
      setTimeout(() => {
        toggleLikeStore(ctx.postId, ctx.previous);
      }, 0);

      const updater = (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages?.map((page: any) => ({
            ...page,
            posts: page.posts?.map((p: any) => {
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
                    ? (p.stats?.likesCount ?? 0) + 1
                    : (p.stats?.likesCount ?? 0) - 1,
                },
              };
            }),
          })),
        };
      };

      FEED_KEYS.forEach((key) => {
        queryClient.setQueriesData({ queryKey: key, exact: false }, updater);
      });
    },

    onSuccess: (data, { postId }) => {
      const newCount = data?.stats?.likesCount;

      // invalidate to sync backend truth
      FEED_KEYS.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      if (typeof newCount !== "number") return;

      const updater = (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages?.map((page: any) => ({
            ...page,
            posts: page.posts?.map((p: any) => {
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
      };

      FEED_KEYS.forEach((key) => {
        queryClient.setQueriesData({ queryKey: key, exact: false }, updater);
      });
    },
  });
}
