import { PostCard } from "@/components/post/PostCard";
import { useFeedStore } from "@/components/store/FeedStore";
import colors from "@/constants/colors";
import { Post } from "@/types/post";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";

export default function PostViewerScreen() {
  const { height } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();

  const feedHeight = height - tabBarHeight;
  const { postId, feedKey } = useLocalSearchParams();
  const { getFeed } = useFeedStore();

  const [feed, setFeed] = useState<Post[]>([]);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  /* ================= LOAD FEED ================= */
  useEffect(() => {
    const savedFeed = getFeed(feedKey as string) || [];
    setFeed(savedFeed);
  }, [feedKey, getFeed]);

  const initialIndex = feed.findIndex((p) => p.id === postId);

  /* ================= SCROLL TO INITIAL POST ================= */
  useEffect(() => {
    if (flatListRef.current && initialIndex >= 0 && feed.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
        setActivePostId(feed[initialIndex]?.id ?? null);
      }, 0);
    }
  }, [feed, initialIndex]);

  /* ================= VIEWABILITY ================= */
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActivePostId(viewableItems[0].item.id);
      }
    },
  ).current;

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        isPlaying={item.id === activePostId}
        screenHeight={feedHeight}
      />
    ),
    [activePostId, height],
  );

  /* ================= LOADING ================= */

  let content: React.ReactNode;

  if (!feed.length) {
    content = (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  } else {
    content = (
      <FlatList
        ref={flatListRef}
        data={feed}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={feedHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={(_, index) => ({
          length: feedHeight,
          offset: feedHeight * index,
          index,
        })}
        windowSize={3}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        removeClippedSubviews
      />
    );
  }

  return (
    <SafeAreaView  edges={["top"]} style={{ flex: 1 }}>
      <YStack style={{ flex: 1 }}>{content}</YStack>
    </SafeAreaView>
  );
}
