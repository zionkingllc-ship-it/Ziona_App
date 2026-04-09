import { PostCard } from "@/components/post/PostCard";
import { usePostActionsStore } from "@/store/usePostActionStore";
import { FeedPost } from "@/types/feedTypes";
import { mergePostState } from "@/utils/post/postState/mergePostState";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, FlatList, ViewToken } from "react-native";

type Props = {
  posts: FeedPost[];
  initialIndex?: number;
  containerHeight: number;
  containerWidth: number;
  tabBarHeight: number;
};

export function PostViewerEngine({
  posts,
  initialIndex = 0,
  containerHeight,
  containerWidth,
  tabBarHeight,
}: Props) {
  const flatListRef = useRef<FlatList<FeedPost>>(null);
  const hasScrolledRef = useRef(false);

  const [activePostId, setActivePostId] = useState<string | null>(null);

  const likedMap = usePostActionsStore((s) => s.likedPosts);
  const savedMap = usePostActionsStore((s) => s.savedPosts);
  const followedMap = usePostActionsStore((s) => s.followedUsers);

  const mergedPosts = useMemo(() => {
    return posts.map((p) =>
      mergePostState(p, {
        likedPosts: likedMap,
        savedPosts: savedMap,
        followedUsers: followedMap,
      }),
    );
  }, [posts, likedMap, savedMap, followedMap]);

  /* 🔥 FORCE FIRST VIDEO PLAY */
  useEffect(() => {
    if (!activePostId && mergedPosts.length > 0) {
      setActivePostId(mergedPosts[0].id);
    }
  }, [mergedPosts]);

  /* INITIAL SCROLL */
  useEffect(() => {
    if (hasScrolledRef.current) return;
    if (!mergedPosts.length) return;
    if (!containerHeight) return;

    requestAnimationFrame(() => {
      flatListRef.current?.scrollToOffset({
        offset: initialIndex * containerHeight,
        animated: false,
      });

      setActivePostId(mergedPosts[initialIndex]?.id ?? null);
      hasScrolledRef.current = true;
    });
  }, [mergedPosts, initialIndex, containerHeight]);

  /* APP STATE */
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        setActivePostId(null);
      }
    });

    return () => sub.remove();
  }, []);

  /* VIEWABILITY */
  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems.length) return;

      const current = viewableItems[0]?.item;
      if (!current?.id) return;

      console.log("VISIBLE:", current.id);
      setActivePostId(current.id);
    },
    [],
  );

  /* RENDER */
  const renderItem = useCallback(
    ({ item }: { item: FeedPost }) => {
      const isPlaying = item.id === activePostId;

      console.log("RENDER:", item.id, "PLAY:", isPlaying);

      return (
        <PostCard
          post={item}
          isPlaying={isPlaying}
          screenHeight={containerHeight}
          screenWidth={containerWidth}
          tabBarHeight={tabBarHeight}
        />
      );
    },
    [activePostId, containerHeight, containerWidth, tabBarHeight],
  );

  if (!containerHeight) return null;

  return (
    <FlatList
      ref={flatListRef}
      data={mergedPosts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      pagingEnabled
      snapToInterval={containerHeight}
      decelerationRate="fast"
      windowSize={3}
      maxToRenderPerBatch={2}
      removeClippedSubviews={false}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      showsVerticalScrollIndicator={false}
    />
  );
}