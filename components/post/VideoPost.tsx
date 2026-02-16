import { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { YStack, Text } from "tamagui";
import { Play } from "@tamagui/lucide-icons";
import { VideoPost as VideoPostType } from "@/types/post";

type Props = {
  post: VideoPostType;
  isActive: boolean;
};

export function VideoPost({ post, isActive }: Props) {
  const videoRef = useRef<Video>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive && !paused) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
  }, [isActive, paused]);

  const togglePlayback = () => {
    setPaused((prev) => !prev);
  };

  const source =
    typeof post.media.videoUrl === "string"
      ? { uri: post.media.videoUrl }
      : post.media.videoUrl;

  return (
    <Pressable style={{ flex: 1 }} onPress={togglePlayback}>
      <Video
        ref={videoRef}
        source={source}
        style={{ width: "100%", height: "100%" }}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay={false}
      />

      {/* Play icon overlay */}
      {paused && (
        <YStack
          position="absolute"
          top="50%"
          left="50%"
          transform={[{ translateX: -24 }, { translateY: -24 }]}
          backgroundColor="rgba(0,0,0,0.4)"
          borderRadius={999}
          padding="$3"
        >
          <Play color="white" size={32} />
        </YStack>
      )}

      {/* Caption */}
      {post.caption && (
        <YStack position="absolute" bottom={80} left={16} right={80}>
          <Text color="white" fontSize="$5">
            {post.caption}
          </Text>
        </YStack>
      )}
    </Pressable>
  );
}