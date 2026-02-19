// components/screens/ProfileScreen.tsx

import CenteredMessage from "@/components/ui/CenteredMessage";
import colors from "@/constants/colors";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

type Post = {
  id: string;
  image: string;
};

const mockPosts: Post[] = [
  { id: "1", image: "https://picsum.photos/300/300?1" },
  { id: "2", image: "https://picsum.photos/300/300?2" },
  { id: "3", image: "https://picsum.photos/300/300?3" },
  { id: "4", image: "https://picsum.photos/300/300?4" },
  { id: "5", image: "https://picsum.photos/300/300?5" },
  { id: "6", image: "https://picsum.photos/300/300?6" },
];

export default function ProfileScreen() {
  const { width } = useWindowDimensions();

  // Toggle between [] and mockPosts to test empty vs populated
  const [posts] = useState<Post[]>(mockPosts);
  const [activeTab, setActiveTab] = useState<"posts" | "videos">("posts");

  const renderPost = ({ item }: { item: Post }) => (
    <Image
      source={{ uri: item.image }}
      style={{
        width: width / 3 - 4,
        height: width / 3 - 4,
        margin: 2,
        borderRadius: 6,
      }}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      {/* ---------------- HEADER ---------------- */}
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$4"
        marginBottom="$3"
      >
        <Text fontSize={16}>@ZionChild123</Text>
        <Text>⚙️</Text>
      </XStack>

      {/* ---------------- PROFILE INFO ---------------- */}
      <YStack alignItems="center" marginBottom="$4">
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#C084FC",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Text color="white" fontWeight="600">
            ZK
          </Text>
        </View>

        <Text fontSize={18} fontWeight="600">
          Zion kay
        </Text>

        {posts.length > 0 && (
          <Text
            fontSize={13}
            color={colors.gray}
            textAlign="center"
            marginTop="$2"
            paddingHorizontal="$4"
          >
            Christian worshipper sharing moments of praise, reflection, and
            growth. Here to connect with others.
          </Text>
        )}

        <TouchableOpacity
          style={{
            marginTop: 12,
            backgroundColor: "#eee",
            paddingHorizontal: 16,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Text fontSize={12}>Edit profile</Text>
        </TouchableOpacity>
      </YStack>

      {/* ---------------- STATS ---------------- */}
      <XStack justifyContent="space-around" marginBottom="$3">
        <YStack alignItems="center">
          <Text fontWeight="600">{posts.length}</Text>
          <Text fontSize={12} color={colors.gray}>
            posts
          </Text>
        </YStack>
        <YStack alignItems="center">
          <Text fontWeight="600">20</Text>
          <Text fontSize={12} color={colors.gray}>
            Followers
          </Text>
        </YStack>
        <YStack alignItems="center">
          <Text fontWeight="600">9</Text>
          <Text fontSize={12} color={colors.gray}>
            Following
          </Text>
        </YStack>
      </XStack>

      {/* ---------------- TABS ---------------- */}
      {posts.length > 0 && (
        <XStack justifyContent="center" gap="$6" marginBottom="$3">
          <TouchableOpacity onPress={() => setActiveTab("posts")}>
            <Text color={activeTab === "posts" ? colors.black : colors.gray}>
              ▦
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab("videos")}>
            <Text color={activeTab === "videos" ? colors.black : colors.gray}>
              🎥
            </Text>
          </TouchableOpacity>
        </XStack>
      )}

      {/* ---------------- CONTENT ---------------- */}
      {posts.length === 0 ? (
        <CenteredMessage
          text="Your message matters"
          subtitle="Create with intention. Post with purpose."
          actionLabel="Create Post"
          onActionPress={() => router.navigate("Create")}
          fullScreen={false}
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          numColumns={3}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
