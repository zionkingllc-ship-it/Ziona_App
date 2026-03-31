import Header from "@/components/layout/header";
import CenteredMessage from "@/components/ui/CenteredMessage";
import colors from "@/constants/colors";
import { generateVideoThumbnail } from "@/helpers/thumbnailGenerator";
import { usePostActionsStore } from "@/store/usePostActionStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, XStack, YStack } from "tamagui";
import { getPostState } from "@/utils/post/getPostState";
import { FeedPost } from "@/types/feedTypes";
import { useUserPosts } from "@/hooks/useUserPost";

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const itemSize = width / 3 - 4;

  const { posts, isLoading } = useUserPosts(); // ✅ NO MOCK

  const [activeTab, setActiveTab] = useState<"posts" | "liked" | "bookmarks">(
    "posts"
  );
  const [videoThumbnails, setVideoThumbnails] = useState<
    Record<string, string>
  >({});

  const likes = usePostActionsStore((state: any) => state.likes);
  const bookmarks = usePostActionsStore((state: any) => state.bookmarks);

  const postInActive = require("@/assets/images/postsIcon.png");
  const postActive = require("@/assets/images/postIconActive.png");
  const likedPostActive = require("@/assets/images/heartIconActive.png");
  const likedPostInActive = require("@/assets/images/heartIcon.png");
  const bookmarkPostActive = require("@/assets/images/postsIcon.png");
  const bookmarkInActive = require("@/assets/images/bookmarkBlackIcon.png");
  const settingIcon = require("@/assets/images/settingsIcon.png");
  const profileShareIcon = require("@/assets/images/shareProfileIcon.png");


  
  /* ================= VIDEO THUMBNAILS ================= */

  useEffect(() => {
  if (!posts.length) return;

  let isMounted = true;

  async function generateThumbnails() {
    const thumbnails: Record<string, string> = {};

    for (const post of posts) {
      if (post.type === "media") {
        const media = post.media?.[0];
        if (!media) continue;

        if (media.type === "video") {
          if (media.thumbnailUrl) {
            thumbnails[post.id] = media.thumbnailUrl;
          } else if (media.url) {
            const generated = await generateVideoThumbnail(media.url);
            if (generated) thumbnails[post.id] = generated;
          }
        }
      }
    }

    if (isMounted) {
      setVideoThumbnails((prev) => {
        const prevKeys = Object.keys(prev);
        const newKeys = Object.keys(thumbnails);

        if (
          prevKeys.length === newKeys.length &&
          prevKeys.every((k) => prev[k] === thumbnails[k])
        ) {
          return prev;
        }

        return thumbnails;
      });
    }
  }

  generateThumbnails();

  return () => {
    isMounted = false;
  };
}, [posts]);

  /* ================= FILTER ================= */

  const filteredPosts = useMemo(() => {
  if (activeTab === "liked") {
    return posts.filter((post) => getPostState(post).liked);
  }

  if (activeTab === "bookmarks") {
    return posts.filter((post) => getPostState(post).saved);
  }

  return posts;
}, [activeTab, posts]);
  /* ================= THUMBNAIL ================= */

  const getPostThumbnail = (post: FeedPost) => {
    if (post.type === "media") {
      const media = post.media?.[0];

      if (!media) return undefined;

      if (media.type === "image") {
        return { uri: media.url };
      }

      if (media.type === "video") {
        return videoThumbnails[post.id]
          ? { uri: videoThumbnails[post.id] }
          : undefined;
      }
    }

    return undefined;
  };

  const renderPost = ({ item }: { item: FeedPost }) => {
    const thumbnailSource = getPostThumbnail(item);

    const isVideo =
      item.type === "media" && item.media?.[0]?.type === "video";

    const isCarousel =
      item.type === "media" && item.media && item.media.length > 1;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/profile/post/[postId]",
            params: { postId: item.id },
          })
        }
        style={{
          width: itemSize,
          height: itemSize,
          margin: 2,
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: colors.gray,
        }}
      >
        {thumbnailSource && (
          <Image
            source={thumbnailSource}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        )}

        {isVideo && (
          <Ionicons
            name="videocam"
            size={18}
            color="white"
            style={{
              position: "absolute",
              top: 6,
              left: 6,
            }}
          />
        )}

        {isCarousel && (
          <Ionicons
            name="images"
            size={18}
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
    <SafeAreaView
      style={{ flex: 1, marginTop: 20, backgroundColor: colors.white }}
    >
      {/* HEADER */}
      <Header
        heading="@EmmanuelAkinyemi"
        imageAfter2={settingIcon}
        imageAfter={profileShareIcon}
      />

      {/* PROFILE INFO */}
      <YStack width={"100%"} padding={20}>
        <XStack width={"100%"} justifyContent="space-between">
          <YStack alignItems="center" alignSelf="flex-start">
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
              <Text
                fontFamily={"$body"}
                color="white"
                fontSize={"$4"}
                fontWeight="600"
              >
                ZK
              </Text>
            </View>

            <Text fontFamily={"$body"} fontSize={"$5"} fontWeight="600">
              Zion Kay
            </Text>
          </YStack>

          <TouchableOpacity
            onPress={() => router.push("/profile/edit")}
            style={{
              marginTop: 12,
              backgroundColor: "#eeeeee",
              width: "30%",
              height: "30%",
              borderRadius: 99,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text fontFamily={"$body"} fontSize={13} fontWeight={"400"}>
              Edit profile
            </Text>
          </TouchableOpacity>
        </XStack>

        <Text
          fontFamily={"$body"}
          fontSize={13}
          color={colors.gray}
          fontWeight={"400"}
        >
          Christian worshipper sharing moments of praise, reflection, and
          growth. Here to connect with others, grow in faith, and celebrate
          worship as a daily lifestyle.
        </Text>
      </YStack>

      {/* STATS */}
      <XStack width={"100%"} height={"11%"}>
        <YStack alignItems="center" justifyContent="center" width={"33.3%"}>
          <Text fontFamily={"$body"} fontWeight="500" fontSize={"$4"}>
            {posts.length}
          </Text>
          <Text fontFamily={"$body"} fontSize={13} color={colors.gray}>
            Posts
          </Text>
        </YStack>

        <YStack alignItems="center" justifyContent="center" width={"33.3%"}>
          <Text fontFamily={"$body"} fontWeight="500" fontSize={"$4"}>
            20
          </Text>
          <Text fontFamily={"$body"} fontSize={13} color={colors.gray}>
            Followers
          </Text>
        </YStack>

        <YStack alignItems="center" justifyContent="center" width={"33.3%"}>
          <Text fontFamily={"$body"} fontWeight="500" fontSize={"$4"}>
            9
          </Text>
          <Text fontFamily={"$body"} fontSize={"$3"} color={colors.gray}>
            Following
          </Text>
        </YStack>
      </XStack>

      {/* TABS */}
      <XStack
        width={"50%"}
        height={"6%"}
        alignSelf="center"
        justifyContent="center"
        alignItems="center"
        padding={10}
      >
        <TouchableOpacity
          style={{ width: "33.33%", height: "100%" }}
          onPress={() => setActiveTab("posts")}
        >
          <Image
            source={activeTab === "posts" ? postActive : postInActive}
            style={{ width: 24, height: 24, alignSelf: "flex-start" }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ width: "33.33%", height: "100%" }}
          onPress={() => setActiveTab("liked")}
        >
          <Image
            source={activeTab === "liked" ? likedPostActive : likedPostInActive}
            style={{ width: 24, height: 24, alignSelf: "center" }}
          />
        </TouchableOpacity>
      </XStack>

      {/* CONTENT */}
      {isLoading ? (
        <CenteredMessage text="Loading..." fontFamily={"$body"} />
      ) : filteredPosts.length === 0 ? (
        <YStack marginTop={"$7"}>
          <CenteredMessage
            fontFamily={"$body"}
            text="Your message matters"
            subtitle="Create with intention. Post with purpose."
            actionLabel="Create Post"
            onActionPress={() => router.navigate("/(tabs)/Create")}
            fullScreen={false}
          />
        </YStack>
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