import CenteredMessage from "@/components/ui/CenteredMessage";
import colors from "@/constants/colors";
import { generateVideoThumbnail } from "@/helpers/thumbnailGenerator";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text, XStack, YStack } from "tamagui";

type Post = {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
};

const mockPosts: Post[] = [
  { id: "1", type: "image", url: "https://picsum.photos/300/300?1" },
  { id: "2", type: "image", url: "https://picsum.photos/300/300?2" },
  {
    id: "3",
    type: "video",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  { id: "4", type: "image", url: "https://picsum.photos/300/300?4" },
  {
    id: "5",
    type: "video",
    url: "https://www.w3schools.com/html/movie.mp4",
  },
];

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const [posts] = useState<Post[]>(mockPosts);
  const [activeTab, setActiveTab] = useState<"posts" | "videos">("posts");
  const [videoThumbnails, setVideoThumbnails] = useState<
    Record<string, string>
  >({});

  const itemSize = width / 3 - 4;

  //  Generate thumbnails once for video posts
  useEffect(() => {
    async function generateThumbnails() {
      const updatedThumbnails: Record<string, string> = {};

      for (const post of posts) {
        if (post.type === "video") {
          if (post.thumbnailUrl) {
            updatedThumbnails[post.id] = post.thumbnailUrl;
          } else {
            const generated = await generateVideoThumbnail(post.url);
            if (generated) {
              updatedThumbnails[post.id] = generated;
            }
          }
        }
      }

      setVideoThumbnails(updatedThumbnails);
    }

    generateThumbnails();
  }, [posts]);

  //  Filter posts based on tab
  const filteredPosts = useMemo(() => {
    if (activeTab === "videos") {
      return posts.filter((post) => post.type === "video");
    }
    return posts;
  }, [activeTab, posts]);

  const renderPost = ({ item }: { item: Post }) => {
    const imageSource =
      item.type === "image"
        ? { uri: item.url }
        : videoThumbnails[item.id]
        ? { uri: videoThumbnails[item.id] }
        : undefined;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/discover/[postId]",
            params: { postId: item.id },
          })
        }
        style={{
          width: itemSize,
          height: itemSize,
          margin: 2,
          borderRadius: 6,
          overflow: "hidden",
          backgroundColor: colors.gray,
        }}
      >
        {imageSource && (
          <Image
            source={imageSource}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        )}

        {item.type === "video" && (
          <Ionicons
            name="videocam"
            size={16}
            color="white"
            style={{
              position: "absolute",
              top: 6,
              left: 6,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      {/* HEADER */}
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$4"
        marginBottom="$3"
      >
        <Text fontSize={16}>@ZionChild123</Text>
        <Text>⚙️</Text>
      </XStack>

      {/* PROFILE INFO */}
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
          Zion Kay
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
            backgroundColor: "#eeeeee",
            paddingHorizontal: 16,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Text fontSize={12}>Edit profile</Text>
        </TouchableOpacity>
      </YStack>

      {/* STATS */}
      <XStack justifyContent="space-around" marginBottom="$3">
        <YStack alignItems="center">
          <Text fontWeight="600">{posts.length}</Text>
          <Text fontSize={12} color={colors.gray}>
            Posts
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

      {/* TABS */}
      {posts.length > 0 && (
        <XStack justifyContent="center" gap="$6" marginBottom="$3">
          <TouchableOpacity onPress={() => setActiveTab("posts")}>
            <Text
              color={activeTab === "posts" ? colors.black : colors.gray}
              fontSize={18}
            >
              ▦
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab("videos")}>
            <Text
              color={activeTab === "videos" ? colors.black : colors.gray}
              fontSize={18}
            >
              🎥
            </Text>
          </TouchableOpacity>
        </XStack>
      )}

      {/* CONTENT */}
      {filteredPosts.length === 0 ? (
        <CenteredMessage
          text="Your message matters"
          subtitle="Create with intention. Post with purpose."
          actionLabel="Create Post"
          onActionPress={() => router.navigate("Create")}
          fullScreen={false}
        />
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          numColumns={3}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}