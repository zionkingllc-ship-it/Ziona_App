import { FeedPost } from "@/types/feedTypes";
import React from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import CarouselPostCard from "../CarouselPostCard";
import TextPostCard from "../TextPostCard";
import VideoPostCard from "../VideoPostCard";

interface Props {
  post: FeedPost;
  isPlaying: boolean;
  onTogglePlay?: () => void;
  onLike?: () => void;
  screenWidth: number;
  screenHeight: number;
  tabBarHeight: number;
}

export default function PostMedia({
  post,
  isPlaying,
  onTogglePlay,
  onLike,
  screenWidth,
  screenHeight,
  tabBarHeight,
}: Props) {
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  const triggerHeart = () => {
    heartScale.value = 0;
    heartOpacity.value = 1;

    heartScale.value = withTiming(1.2, { duration: 180 }, () => {
      heartScale.value = withTiming(1, { duration: 100 }, () => {
        heartScale.value = withTiming(0, { duration: 200 });
        heartOpacity.value = withTiming(0, { duration: 200 });
      });
    });
  };

  /* ================= MEDIA ================= */
  if (post.type === "media") {
    // 🔥 NO CAST — TRUST TYPE NARROWING

    if (post.mediaType === "video") {
      if (!post.media?.length || !post.media[0]?.url) {
        console.warn("[PostMedia] ❌ Invalid video media", post);
        return null;
      }

      return (
        <VideoPostCard
          post={post} // ✅ now STRICT video type
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onLike={onLike}
          heartStyle={heartStyle}
          triggerHeart={triggerHeart}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          tabBarHeight={tabBarHeight}
        />
      );
    }

    // ✅ IMAGE SAFE PATH
    if (!post.media?.length) {
      console.warn("[PostMedia] ❌ Empty image media", post);
      return null;
    }

    return (
      <CarouselPostCard
        post={post}
        onLike={onLike}
        heartStyle={heartStyle}
        triggerHeart={triggerHeart}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />
    );
  }

  /* ================= TEXT / BIBLE ================= */
  if (post.type === "text" || post.type === "bible") {
    return <TextPostCard post={post} onLike={onLike} />;
  }

  return null;
}