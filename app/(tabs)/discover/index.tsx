import { FlatList, ViewToken } from "react-native";
import { useRef, useState } from "react";
import { PostCard } from "@/components/post/PostCard";
import { Post } from "@/types/post";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "tamagui";
import colors from "@/constants/colors";

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    type: "video",
    author: {
      id: "user-1",
      name: "Ziona",
    },
    media: {
      type: "video",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    caption: "If you are willing to pray, there is always a God to answer",
    liked: false,
    likesCount: 432,
    createdAt: new Date().toISOString(),
  },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: colors.primary,
            marginBottom: 24,
          }}
        >
          profile
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
