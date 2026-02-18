import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ViewToken,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFeedStore } from "@/components/store/FeedStore";
import { PostCard } from "@/components/post/PostCard";
import CenteredMessage from "@/components/ui/CenteredMessage";
import { Post } from "@/types/post";
import { YStack } from "tamagui";

export default function PostViewerScreen() {
  const { height } = Dimensions.get("window");
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
    }
  ).current;

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard post={item} isPlaying={item.id === activePostId} screenHeight={height} />
    ),
    [activePostId, height]
  );

  /* ================= RENDER STATES ================= */
  let content: React.ReactNode;

  if (!feed.length) {
    content = (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
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
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
        windowSize={3}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        removeClippedSubviews
      />
    );
  }

  return <YStack style={{ flex: 1, paddingVertical:10}}>{content}</YStack>;
}