import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, ViewToken } from "react-native";
import { View } from "tamagui";

import FeedHeader from "@/components/feedHeader";
import { PostCard } from "@/components/post/PostCard";
import colors from "@/constants/colors";
import { preloadPostMedia } from "@/helpers/preloadMedia";
import { useFollowingFeed, useForYouFeed } from "@/hooks/useFeed";
import { FeedPost } from "@/types/feedTypes";
import { normalizePost } from "@/utils/feed/normalizePost";

export default function Feed() {
  const tabBarHeight = useBottomTabBarHeight();
  const flatListRef = useRef<FlatList<FeedPost>>(null);
  const queryClient = useQueryClient();

  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<"forYou" | "following">("forYou");
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const [pausedPostId, setPausedPostId] = useState<string | null>(null);
  const forYouQuery = useForYouFeed();
  const followingQuery = useFollowingFeed();
  const query = feedType === "forYou" ? forYouQuery : followingQuery;

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["feed"], exact: false });
      setActivePostId(null);
    }, [queryClient]),
  );

  const pages =
    (query.data as InfiniteData<{ posts: any[] }> | undefined)?.pages ?? [];

  const data: FeedPost[] = pages
    .flatMap((page) => page.posts ?? [])
    .map((p) => normalizePost(p))
    .filter((p): p is FeedPost => {
      if (!p) return false;

      if (p.type === "media") {
        return Array.isArray(p.media) && p.media.length > 0;
      }

      return true;
    });

  useEffect(() => {
    setActivePostId(null);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [feedType]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 200,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems.length) return;
      setPausedPostId(null);
      const current = viewableItems[0].item;
      if (!current?.id) return;

      setActivePostId(current.id);

      const index = data.findIndex((p) => p.id === current.id);

      if (index >= 0) {
        if (data[index + 1]) preloadPostMedia(data[index + 1] as any);
        if (data[index - 1]) preloadPostMedia(data[index - 1] as any);
      }
    },
  ).current;

const renderItem = useCallback(
  ({ item }: { item: FeedPost }) => (
    <PostCard
      post={item}
      isPlaying={
        item.id === activePostId && item.id !== pausedPostId
      }
      onTogglePlay={() => {
        setPausedPostId((prev) =>
          prev === item.id ? null : item.id
        );
      }}
      screenHeight={containerHeight}
      screenWidth={containerWidth}
      tabBarHeight={tabBarHeight}
    />
  ),
  [activePostId, pausedPostId, containerHeight, containerWidth, tabBarHeight]
);

  if (query.isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View flex={1}>
      <View width="100%" marginTop={35}>
        <FeedHeader
          feedType={feedType}
          onChangeFeedType={setFeedType}
          emptyFollowing={data.length === 0}
        />
      </View>

      <View
        style={{ flex: 1 }}
        onLayout={(e) => {
          const { height, width } = e.nativeEvent.layout;
          if (height !== containerHeight) setContainerHeight(height);
          if (width !== containerWidth) setContainerWidth(width);
        }}
      >
        {data.length === 0 ? (
          <View flex={1} justifyContent="center" alignItems="center">
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontFamily: "$body",
                fontWeight: "400",
              }}
            >
              No posts yet, be the first to create a post
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            pagingEnabled
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            snapToInterval={containerHeight}
            snapToAlignment="start"
            getItemLayout={(_, index) => ({
              length: containerHeight,
              offset: containerHeight * index,
              index,
            })}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            windowSize={3}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            removeClippedSubviews
          />
        )}
      </View>
    </View>
  );
}
