// components/screens/DiscoverScreen.tsx
import PostThumbnail from "@/components/discover/PostThumbnail";
import { useFeedStore } from "@/components/store/FeedStore";
import colors from "@/constants/colors";
import { MOCK_POSTS } from "@/constants/examplePost";
import { Post } from "@/types/post";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Text, XStack, YStack } from "tamagui";

export type DiscoverCategory = {
  id: string;
  label: string;
  icon: any;
  bgColor: string;
  bdColor: string;
};

const mockCategories: DiscoverCategory[] = [
  {
    id: "all",
    label: "All",
    icon: require("@/assets/images/all.png"),
    bgColor: "#F3F2D8",
    bdColor: "#CAC653",
  },
  {
    id: "love",
    label: "Love",
    icon: require("@/assets/images/love.png"),
    bgColor: "#F3D8DA",
    bdColor: "#C8545D",
  },
  {
    id: "trust",
    label: "Trust",
    icon: require("@/assets/images/trust.png"),
    bgColor: "#D8DBF3",
    bdColor: "#292E62",
  },
  {
    id: "worship",
    label: "Worship",
    icon: require("@/assets/images/worship.png"),
    bgColor: "#F3E8D8",
    bdColor: "#C89854",
  },
  {
    id: "patience",
    label: "Patience",
    icon: require("@/assets/images/patience.png"),
    bgColor: "#F3D8EB",
    bdColor: "#682253",
  },
  {
    id: "prayer",
    label: "Prayer",
    icon: require("@/assets/images/prayer.png"),
    bgColor: "#D8F3ECE8",
    bdColor: "#226858",
  },
];

export default function DiscoverScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { setFeed } = useFeedStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filter, setFilter] = useState<"all" | "carousel" | "video" | "text">(
    "all",
  );
  const [viewType, setViewType] = useState<"categories" | "posts">(
    "categories",
  );

  const filteredPosts = MOCK_POSTS.filter((post) => {
    if (filter !== "all" && post.type !== filter) return false;
    if (selectedCategory !== "all" && post.type === "text") return true; // placeholder
    return true;
  });

  const feedKey = `discover:${selectedCategory}`;

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <PostThumbnail
        post={item}
        size={width / 3 - 9}
        onPress={() => {
          // Save current feed to FeedStore
          const feedKey = `discover:${selectedCategory}`;
          setFeed(feedKey, filteredPosts);

          // Navigate to PostViewer
          router.push(
            `/discover/${item.id}?feedKey=${encodeURIComponent(feedKey)}`,
          );
        }}
      />
    ),
    [width, filteredPosts, feedKey, setFeed],
  );

  const renderCategory = useCallback(
    ({ item }: { item: DiscoverCategory }) => (
      <TouchableOpacity
        style={{
          flex: 1,
          margin: 8,
          height: 100,
          borderRadius: 12,
          backgroundColor: item.bgColor,
          borderColor: item.bdColor,
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          setSelectedCategory(item.id);
          setViewType("posts");
        }}
      >
        <Image
          source={item.icon}
          style={{ width: 40, height: 40, marginBottom: 8 }}
        />
        <Text fontWeight="600">{item.label}</Text>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <YStack style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Search Bar */}
      <View
        style={{
          margin: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.gray,
          paddingHorizontal: 12,
        }}
      >
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ height: 40 }}
        />
      </View>

      {viewType === "categories" ? (
        <FlatList
          data={mockCategories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategory}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <XStack style={{ paddingHorizontal: 16, marginBottom: 12 }} gap="$2">
            {(["all", "carousel", "video", "text"] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 6,
                  backgroundColor: filter === f ? colors.primary : "#f0f0f0",
                }}
              >
                <Text
                  style={{
                    color: filter === f ? colors.white : colors.primary,
                    fontWeight: "600",
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </XStack>

          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            renderItem={renderPost}
            numColumns={3}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </YStack>
  );
}
