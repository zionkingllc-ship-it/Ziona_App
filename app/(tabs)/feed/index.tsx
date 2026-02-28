import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  ViewToken,
} from "react-native";
import { useScreenDimensions } from "@/context/ScreenDimensionsContext";

import FollowSuggestions from "@/components/following/FollowingSuggestions";
import { PostCard } from "@/components/post/PostCard";
import CenteredMessage from "@/components/ui/CenteredMessage";
import FeedHeader from "@/components/feedHeader";
import colors from "@/constants/colors";
import { useFollowingFeed, useForYouFeed } from "@/hooks/useFeed";
import { Post } from "@/types/post";
import { useFocusEffect } from "@react-navigation/native";
import { Text, XStack, YStack } from "tamagui";

export default function Feed() {
  const { topInset } = useScreenDimensions();

  const flatListRef = useRef<FlatList<Post>>(null);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<"forYou" | "following">("forYou");
  const [containerHeight, setContainerHeight] = useState(0);

  const forYouQuery = useForYouFeed();
  const followingQuery = useFollowingFeed();
  const query = feedType === "forYou" ? forYouQuery : followingQuery;

  const pages = query.data?.pages ?? [];
  const data: Post[] = pages.flatMap((page) => page.posts ?? []);
  const followsCount = followingQuery.data?.pages?.[0]?.followsCount ?? 0;

  useFocusEffect(
    useCallback(() => {
      return () => setActivePostId(null);
    }, [])
  );

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
      if (viewableItems.length > 0 && viewableItems[0].item?.id) {
        setActivePostId(viewableItems[0].item.id);
      }
    }
  ).current;

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        isPlaying={item.id === activePostId}
        screenHeight={containerHeight}
        screenWidth={undefined as any} // not needed for snap anymore
      />
    ),
    [activePostId, containerHeight]
  );

  if (query.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.black, paddingTop: topInset }}>
      <FeedHeader
        feedType={feedType}
        onChangeFeedType={setFeedType}
        emptyFollowing={false}
      />

      {/* 👇 THIS is the only height that matters */}
      <View
        style={{ flex: 1 }}
        onLayout={(e) => {
          const height = e.nativeEvent.layout.height;
          if (height !== containerHeight) {
            setContainerHeight(height);
          }
        }}
      >
        {containerHeight > 0 && (
          <FlatList<Post>
            ref={flatListRef}
            data={data}
            keyExtractor={(item) => item.id.toString()}
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