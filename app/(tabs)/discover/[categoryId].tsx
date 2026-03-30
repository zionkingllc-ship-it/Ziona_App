import PostThumbnail from "@/components/discover/PostThumbnail";
import SearchHeader from "@/components/SearchHeader";
import { useFeedStore } from "@/components/store/FeedStore";
import colors from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, XStack } from "tamagui";
import { useDiscoverFeed } from "@/hooks/useDiscover";
import { FeedPost } from "@/types/feedTypes";
import { useViewerStore } from "@/store/useViewerStore";

export default function DiscoverCategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { width } = useWindowDimensions();
  const { setFeed } = useViewerStore()

  const { posts } = useDiscoverFeed(categoryId);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "images" | "video" | "text">(
    "all"
  );

  /* ================= FILTER ================= */

  const filteredPosts = useMemo(() => {
    return posts.filter((post: FeedPost) => {
      if (filter === "images") {
        return post.type === "media" && post.media?.[0]?.type === "image";
      }

      if (filter === "video") {
        return post.type === "media" && post.media?.[0]?.type === "video";
      }

      if (filter === "text") {
        return post.type === "text" || post.type === "bible";
      }

      return true;
    });
  }, [posts, filter]);

  const feedKey = `discover:${categoryId}`;

  /* ================= RENDER ================= */

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ flex: 1 }}>
        <SearchHeader
          value={searchQuery}
          onChangeText={setSearchQuery}
          onBackPress={() => router.back()}
        />

        {/* FILTER BAR */}
        <XStack style={{ paddingHorizontal: 16, marginBottom: 12 }} gap="$2">
          {(["all", "images", "video", "text"] as const).map((f) => (
            <Text
              key={f}
              paddingHorizontal={16}
              paddingVertical={6}
              borderRadius={6}
              borderWidth={1}
              backgroundColor={filter === f ? "#181419" : "#f0f0f0"}
              borderColor={filter === f ? "#181419" : "#EEEBEF"}
              color={filter === f ? colors.white : "#4E4252"}
              onPress={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          ))}
        </XStack>

        {/* GRID */}
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <PostThumbnail
              post={item}
              size={width / 3 - 9}
              onPress={() => {
                setFeed(feedKey, filteredPosts);

                router.push({
                  pathname: "/post/[postId]",
                  params: {
                    postId: item.id,
                    feedKey,
                  },
                });
              }}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}