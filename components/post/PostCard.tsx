import { YStack, XStack, Text, Image } from "tamagui";
import { Dimensions, Pressable } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";
import { Heart, MessageCircle, Share } from "@tamagui/lucide-icons";
import { Post } from "@/types/post";

const { height, width } = Dimensions.get("window");

type Props = {
  post: Post;
  isActive?: boolean;
};

export function PostCard({ post, isActive }: Props) {
  // 🎥 Create video player only for video posts
  const player =
    post.type === "video"
      ? useVideoPlayer(post.media.url, (player) => {
          player.loop = false;
          player.muted = false;
        })
      : null;

  // play / pause based on visibility
  useEffect(() => {
    if (!player) return;

    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <YStack height={height - 100} width={width} backgroundColor="black">
      {/* MEDIA */}
      {post.type === "video" && player && (
        <VideoView
          player={player}
          style={{
            width: "100%",
            height: "100%",
          }}
          contentFit="contain"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      )}

      {post.type === "image" && (
        <Image
          source={{ uri: post.media.imageUrl }}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        />
      )}

      {/* OVERLAY */}
      <XStack
        position="absolute"
        bottom={25}
        left={0}
        right={0}
        padding="$4"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        {/* LEFT: AUTHOR + CAPTION */}
        <YStack flex={1} gap="$2">
          <Text color="white" fontWeight="600">
            @{post.author.name}
          </Text>

          {post.caption && (
            <Text color="white" fontSize="$3">
              {post.caption}
            </Text>
          )}
        </YStack>

        {/* RIGHT: ACTIONS */}
        <YStack gap="$4" alignItems="center">
          <Pressable>
            <Heart color="white" />
            <Text color="white" fontSize="$2">
              {post.likesCount}
            </Text>
          </Pressable>

          <Pressable>
            <MessageCircle color="white" />
          </Pressable>

          <Pressable>
            <Share color="white" />
          </Pressable>
        </YStack>
      </XStack>
    </YStack>
  );
}