import { useInfiniteQuery } from "@tanstack/react-query";
import { graphqlRequest } from "@/services/graphQL/graphqlClient";
import { useAuthStore } from "@/store/useAuthStore";

const GET_LIKED_POSTS = `
  query likedPosts($userId: String!, $limit: Int!, $cursor: String) {
    likedPosts(userId: $userId, limit: $limit, cursor: $cursor) {
      posts {
        id
        type
        caption
        createdAt

        author {
          id
          username
          avatarUrl
        }

        image {
          items {
            id
            url
            thumbnailUrl
            width
            height
          }
        }

        video {
          url
          thumbnailUrl
          duration
          width
          height
        }

        scripture {
          reference
          text
          translation
          book
          chapter
          verseStart
          verseEnd
        }

        stats {
          likesCount
          commentsCount
          sharesCount
          savesCount
        }

        viewerState {
          liked
          saved
          followingAuthor
          isOwner
        }
      }

      nextCursor
      hasMore
    }
  }
`;

export function useLikedPosts() {
  const userId = useAuthStore((s) => s.user?.id);

  return useInfiniteQuery({
    queryKey: ["likedPosts", userId],
    enabled: !!userId,
 
    initialPageParam: undefined,

    queryFn: async ({ pageParam }) => {
      const data = await graphqlRequest(GET_LIKED_POSTS, {
        userId,
        limit: 20,
        cursor: pageParam,
      });

      const res = data?.likedPosts ?? {};

      return {
        posts: res.posts ?? [],
        nextCursor: res.nextCursor ?? null,
        hasMore: res.hasMore ?? false,
      };
    },

    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor ?? undefined;
    },
  });
}