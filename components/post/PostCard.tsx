import { YStack, XStack, Text, Image } from "tamagui";
import { Dimensions, Pressable } from "react-native";
import { Video } from "expo-av";
import { Heart, MessageCircle, Share } from "@tamagui/lucide-icons";
import { Post } from "@/types/post";

const { height } = Dimensions.get("window");

type Props = {
  post: Post;
  isActive?: boolean;
};

export function PostCard({ post, isActive }: Props) {
  return (
    <YStack height={height} backgroundColor="black">
      {/* MEDIA */}
      {post.type === "video" && (
        <Video
          source={{ uri: post.media.url }}
          shouldPlay={isActive}
          resizeMode="cover"
          isLooping
          style={{ flex: 1 }}
        />
      )}

      {post.type === "image" && (
        <Image
          source={{ uri: post.media.imageUrl }}
          style={{ flex: 1 }}
        />
      )}

      {/* OVERLAY */}
      <XStack
        position="absolute"
        bottom={0}
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