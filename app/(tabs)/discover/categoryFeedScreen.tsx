import PostGrid from "@/components/discover/PostGrid";
import { useFeedStore } from "@/components/store/FeedStore";
import { MOCK_POSTS } from "@/constants/examplePost";
import { Post } from "@/types/post";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryFeedScreen() {
  const { categoryId } = useLocalSearchParams();
  const { setFeed } = useFeedStore();

  /* ================= FILTER POSTS ================= */

  const posts = useMemo(() => {
    if (categoryId === "all") return MOCK_POSTS;

    return MOCK_POSTS.filter((post) =>
      post.categories?.includes(categoryId as any)
    );
  }, [categoryId]);

  /* ================= OPEN POST ================= */

  const handlePress = (post: Post) => {
    const feedKey = `category-${categoryId}`;

    setFeed(feedKey, posts);

    router.push({
      pathname: "/post/[postId]",
      params: {
        postId: post.id,
        feedKey,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PostGrid posts={posts} onPress={handlePress} />
    </SafeAreaView>
  );
}