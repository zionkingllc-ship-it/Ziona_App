import colors from "@/constants/colors";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { FeedPost } from "@/types/feedTypes";
import { MoreHorizontal } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

import PostMedia from "./postcard/PostMedia";

/* ICONS */
const likeIcon = require("@/assets/images/likeIcon.png");
const likeIconActive = require("@/assets/images/likeIcon2.png");
const commentIcon = require("@/assets/images/commentIcon.png");
const bookmarkIcon = require("@/assets/images/bookmarkIcon.png");
const bookmarkIconActive = require("@/assets/images/bookmarkIconActive.png");
const shareIcon = require("@/assets/images/shareIcon.png");

type Props = {
  post: FeedPost;
  isPlaying: boolean;
  screenHeight: number;
  screenWidth: number;
  tabBarHeight: number;
};

export function PostCard({
  post,
  isPlaying,
  screenHeight,
  screenWidth,
  tabBarHeight,
}: Props) {
  const [liked, setLiked] = useState(post.viewerState?.liked ?? false);
  const [expanded, setExpanded] = useState(false);

  const { getIconSize, getAvatarSize, getFontSize } = useResponsiveSize();

  useEffect(() => {
    setExpanded(false);
  }, [post.id]);

  const avatarSize = getAvatarSize(30);
  const iconSize = getIconSize(24);
  const fontSizeName = getFontSize(16);
  const fontSizeCaption = getFontSize(16);
  const fontSizeMore = getFontSize(14);
  const fontSizeButton = getFontSize(13);

  return (
    <YStack height={screenHeight} width="100%" backgroundColor="black">
      {/* ================= CONTENT ================= */}
      <PostMedia
        post={post}
        isPlaying={isPlaying}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        tabBarHeight={tabBarHeight}
        onLike={() => setLiked(true)}
      />

      {/* ================= OVERLAY ================= */}
      <YStack position="absolute" bottom={10} width="100%">
        <XStack padding="$4" alignItems="flex-end">
          {/* LEFT SIDE */}
          <YStack flex={1} gap="$2">
            {/* PROFILE */}
            <XStack gap="$4" alignItems="center" flexWrap="wrap">
              <XStack gap="$2" alignItems="center">
                <Image
                  source={
                    post.author?.avatarUrl
                      ? { uri: post.author.avatarUrl }
                      : require("@/assets/images/profile.png")
                  }
                  width={avatarSize}
                  height={avatarSize}
                  borderRadius={avatarSize / 2}
                />

                <Text
                  color={colors.white}
                  fontSize={fontSizeName}
                  fontWeight="500"
                >
                  {post.author?.username || "Unknown"}
                </Text>
              </XStack>

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: colors.white,
                  height: 24,
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  color={colors.white}
                  fontSize={fontSizeButton}
                  fontWeight="500"
                >
                  follow
                </Text>
              </TouchableOpacity>
            </XStack>

            {/* ================= CAPTION (MEDIA ONLY) ================= */}
            {post.type === "media" && post.caption ? (
              <XStack maxWidth={screenWidth * 0.8} alignItems="flex-end">
                <Text
                  color={colors.white}
                  fontWeight="400"
                  fontSize={fontSizeCaption}
                  numberOfLines={expanded ? undefined : 3}
                >
                  {post.caption}
                </Text>

                {post.caption.length > 90 && (
                  <Pressable onPress={() => setExpanded((p) => !p)}>
                    <LinearGradient
                      colors={["transparent", "rgba(55,55,55,0.6)"]}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        height: 24,
                        width: "100%",
                      }}
                    />
                    <Text
                      color={colors.white}
                      fontSize={fontSizeMore}
                      fontWeight="600"
                    >
                      {expanded ? "less" : "more"}
                    </Text>
                  </Pressable>
                )}
              </XStack>
            ) : null}
          </YStack>

          {/* RIGHT SIDE ACTIONS */}
          <YStack gap="$4" alignItems="center">
            {/* LIKE */}
            <Pressable onPress={() => setLiked((p) => !p)}>
              <Image
                source={liked ? likeIconActive : likeIcon}
                width={iconSize}
                height={iconSize}
              />
            </Pressable>

            {/* COMMENT */}
            <Pressable>
              <Image
                source={commentIcon}
                width={iconSize}
                height={iconSize}
              />
            </Pressable>

            {/* BOOKMARK */}
            <Pressable>
              <Image
                source={bookmarkIcon}
                width={iconSize}
                height={iconSize}
              />
            </Pressable>

            {/* SHARE */}
            <Pressable>
              <Image source={shareIcon} width={iconSize} height={iconSize} />
            </Pressable>

            {/* MORE */}
            <Pressable>
              <MoreHorizontal size={iconSize + 4} color={colors.white} />
            </Pressable>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  );
}