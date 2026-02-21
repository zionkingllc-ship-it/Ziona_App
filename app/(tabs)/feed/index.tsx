// import NetInfo from "@react-native-community/netinfo";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FollowSuggestions from "@/components/following/FollowingSuggestions";
import { PostCard } from "@/components/post/PostCard";
import CenteredMessage from "@/components/ui/CenteredMessage";

import FeedHeader from "@/components/feedHeader";
import colors from "@/constants/colors";
import { useFollowingFeed, useForYouFeed } from "@/hooks/useFeed";
import { Post } from "@/types/post"; // adjust path if needed
import { useFocusEffect } from "@react-navigation/native";
import { YStack, XStack } from "tamagui";

export default function Feed() {
  const { height } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const feedHeight = height - tabBarHeight;

  const flatListRef = useRef<FlatList<Post>>(null);

  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<"forYou" | "following">("forYou");

  const forYouQuery = useForYouFeed();
  const followingQuery = useFollowingFeed();

  const query = feedType === "forYou" ? forYouQuery : followingQuery;

  const pages = query.data?.pages ?? [];
  const data: Post[] = pages.flatMap((page) => page.posts ?? []);

  const followsCount = followingQuery.data?.pages?.[0]?.followsCount ?? 0;

  const [isOffline, setIsOffline] = useState(false);

  /* ================= NETWORK ================= */

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     setIsOffline(!state.isConnected);
  //   });

  //   return unsubscribe;
  // }, []);

  useFocusEffect(
    useCallback(() => {
      // SCREEN FOCUSED
      return () => {
        // SCREEN BLURRED (switched tab / navigated away)
        setActivePostId(null);
      };
    }, []),
  );
  /* Reset playback + scroll when switching */
  useEffect(() => {
    setActivePostId(null);
    flatListRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
  }, [feedType]);

  /* ================= VIEWABILITY ================= */

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

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
    [activePostId, feedHeight],
  );

  /* ================= STATE HANDLING ================= */

  let content: React.ReactNode = null;

  if (query.isLoading) {
    content = (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  } else if (query.isError) {
    content = (
      <CenteredMessage
        text="Something went wrong"
        actionLabel="Retry"
        onActionPress={() => query.refetch()}
      />
    );
  } else if (data.length === 0) {
    if (feedType === "following") {
      if (followsCount === 0) {
        content = (
          <YStack flex={1}>
            <XStack marginBottom={40}>
              <FeedHeader
                feedType={feedType}
                onChangeFeedType={setFeedType}
                emptyFollowing={feedType === "following" && followsCount === 0}
              />
            </XStack>

            <FollowSuggestions />
          </YStack>
        );
      } else {
        content = (
          <CenteredMessage text="No posts yet from people you follow." />
        );
      }
    } else {
      content = <CenteredMessage text="No posts available." />;
    }
  } else {
    content = (
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <FeedHeader
          feedType={feedType}
          onChangeFeedType={setFeedType}
          emptyFollowing={feedType === "following" && followsCount === 0}
        />
        <FlatList<Post>
          ref={flatListRef}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          pagingEnabled
          refreshing={query.isRefetching}
          onRefresh={() => query.refetch()}
          onEndReached={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) {
              query.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <ActivityIndicator style={{ marginVertical: 20 }} />
            ) : null
          }
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          snapToInterval={feedHeight}
          snapToAlignment="start"
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
      </View>
    );
  }

  /* ================= RENDER ================= */

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      {isOffline && (
        <View
          style={{
            position: "absolute",
            top: 100,
            alignSelf: "center",
            backgroundColor: "#000",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            zIndex: 20,
          }}
        >
          <Text style={{ color: "#fff" }}>You're offline</Text>
        </View>
      )}

      {content}
    </SafeAreaView>
  );
}
