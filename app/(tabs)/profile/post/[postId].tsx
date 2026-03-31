import { PostCard } from "@/components/post/PostCard";
import colors from "@/constants/colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ViewToken,
  AppState,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, View } from "tamagui";
import { FeedPost } from "@/types/feedTypes";

import { useUserPosts } from "@/hooks/useUserPost";
import { preloadPostMedia } from "@/helpers/preloadMedia";

export default function ProfilePostViewerScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const { postId } = useLocalSearchParams<{ postId: string }>();

  const { posts, isLoading } = useUserPosts(); // 🔥 scoped to current user

  const flatListRef = useRef<FlatList>(null);

  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [pausedPostId, setPausedPostId] = useState<string | null>(null);

  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const hasScrolledRef = useRef(false);

  /* ================= RESET ON NEW POST ================= */

  useEffect(() => {
    hasScrolledRef.current = false;
  }, [postId]);

  /* ================= INITIAL SCROLL ================= */

  useEffect(() => {
    if (
      hasScrolledRef.current ||
      !posts.length ||
      !containerHeight
    )
      return;

    const index = posts.findIndex((p) => p.id === postId);

    if (flatListRef.current && index >= 0) {
      flatListRef.current.scrollToOffset({
        offset: index * containerHeight,
        animated: false,
      });

      setActivePostId(posts[index]?.id ?? null);
      hasScrolledRef.current = true;
    }
  }, [posts, postId, containerHeight]);

  /* ================= FOCUS / APP STATE ================= */

  useFocusEffect(
    useCallback(() => {
      return () => {
        setActivePostId(null);
      };
    }, [])
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        setActivePostId(null);
      }
    });

    return () => sub.remove();
  }, []);

  /* ================= VIEWABILITY ================= */

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

      const index = posts.findIndex((p) => p.id === current.id);

      if (index >= 0) {
        if (posts[index + 1]) {
          preloadPostMedia(posts[index + 1] as any);
        }
        if (posts[index - 1]) {
          preloadPostMedia(posts[index - 1] as any);
        }
      }
    }
  ).current;

  /* ================= RENDER ================= */

  const renderItem = useCallback(
    ({ item }: { item: FeedPost }) => (
      <PostCard
        post={item}
        isPlaying={item.id === activePostId && item.id !== pausedPostId}
        onTogglePlay={() => {
          setPausedPostId((prev) => (prev === item.id ? null : item.id));
        }}
        screenHeight={containerHeight}
        screenWidth={containerWidth}
        tabBarHeight={tabBarHeight}
      />
    ),
    [activePostId, pausedPostId, containerHeight, containerWidth, tabBarHeight]
  );

  if (isLoading || !posts.length) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <YStack style={{ flex: 1 }}>
        <View
          style={{ flex: 1 }}
          onLayout={(e) => {
            const { height, width } = e.nativeEvent.layout;
            if (height !== containerHeight) setContainerHeight(height);
            if (width !== containerWidth) setContainerWidth(width);
          }}
        >
          <FlatList
            ref={flatListRef}
            data={posts}
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
        </View>
      </YStack>
    </SafeAreaView>
  );
}