import { GradientBackground } from "@/components/layout/GradientBackground";
import Header from "@/components/layout/header";
import CenteredMessage from "@/components/ui/CenteredMessage";
import colors from "@/constants/colors";
import { MOCK_POSTS } from "@/constants/examplePost";
import { generateVideoThumbnail } from "@/helpers/thumbnailGenerator";
import { usePostActionsStore } from "@/store/usePostActionStore";
import { Post } from "@/types";
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

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const itemSize = width / 3 - 4;

  const [posts] = useState<Post[]>(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState<"posts" | "liked" | "bookmarks">(
    "posts",
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

  // Generate video thumbnails
  useEffect(() => {
    async function generateThumbnails() {
      const thumbnails: Record<string, string> = {};

      for (const post of posts) {
        if (post.type === "video") {
          // Use backend thumbnail if available
          if (post.media.thumbnailUrl) {
            thumbnails[post.id] = post.media.thumbnailUrl;
          } else if (post.media.videoUrl) {
            const generated = await generateVideoThumbnail(
              post.media.videoUrl.toString(),
            );
            if (generated) {
              thumbnails[post.id] = generated;
            }
          }
        }
      }

      setVideoThumbnails(thumbnails);
    }

    generateThumbnails();
  }, [posts]);

  // Filter posts by active tab
  const filteredPosts = useMemo(() => {
    if (activeTab === "liked") {
      return posts.filter((post) => likes[post.id]);
    } 

    return posts;
  }, [activeTab, posts, likes, ]);

  // Get thumbnail for any post type
  const getPostThumbnail = (post: Post) => {
    switch (post.type) {
      case "image":
        return post.media.items?.[0]
          ? { uri: post.media.items[0].url }
          : undefined;
      case "video":
        return videoThumbnails[post.id]
          ? { uri: videoThumbnails[post.id] }
          : undefined;
      case "carousel":
        return post.media.items?.[0]
          ? { uri: post.media.items[0].url }
          : undefined;
      case "text":
        return { uri: post.media.thumbnailUrl };
      default:
        return undefined;
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    const thumbnailSource = getPostThumbnail(item);

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

        {item.type === "video" && (
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

        {item.type === "carousel" ||
          (item.type === "image" && (
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
          ))}
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
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
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: "33.33%", height: "100%" }}
            onPress={() => setActiveTab("liked")}
          >
            <Image
              source={
                activeTab === "liked" ? likedPostActive : likedPostInActive
              }
              style={{ width: 24, height: 24, alignSelf: "center" }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </XStack>

        {/* CONTENT */}
        {filteredPosts.length === 0 ? (
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
    </GradientBackground>
  );
}
