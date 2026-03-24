import colors from "@/constants/colors";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { FeedPost } from "@/types/feedTypes";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

import PostMedia from "./postcard/PostMedia";

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
  const [manualPaused, setManualPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { getIconSize, getAvatarSize, getFontSize } = useResponsiveSize();

  useEffect(() => {
    if (!isPlaying) setManualPaused(false);
  }, [isPlaying]);

  useEffect(() => {
    setExpanded(false);
  }, [post.id]);

  const effectiveIsPlaying =
    post.type === "media" && post.mediaType === "video"
      ? isPlaying && !manualPaused
      : isPlaying;

  const handleTogglePlay = () => {
    if (post.type === "media" && post.mediaType === "video") {
      setManualPaused((prev) => !prev);
    }
  };

  const avatarSize = getAvatarSize(30);
  const iconSize = getIconSize(24);
  const fontSizeName = getFontSize(16);
  const fontSizeCaption = getFontSize(16);

  return (
    <YStack height={screenHeight} width="100%" backgroundColor="black">
      <PostMedia
        post={post}
        isPlaying={effectiveIsPlaying}
        onTogglePlay={handleTogglePlay}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        tabBarHeight={tabBarHeight}
      />

      <YStack position="absolute" bottom={10} width="100%">
        <XStack padding="$4" alignItems="flex-end">
          <YStack flex={1} gap="$2">
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

            {post.caption ? (
              <XStack maxWidth={screenWidth * 0.8}>
                <Text
                  color={colors.white}
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
                    <Text color={colors.white}>
                      {expanded ? "less" : "more"}
                    </Text>
                  </Pressable>
                )}
              </XStack>
            ) : null}
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  );
}