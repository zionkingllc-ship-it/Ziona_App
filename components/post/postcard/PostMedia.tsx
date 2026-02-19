import { Post } from "@/types/post";
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
  post: Post;
  isPlaying: boolean;
  onTogglePlay?: () => void;
  onLike?: () => void;
}

export default function PostMedia({
  post,
  isPlaying,
  onTogglePlay,
  onLike,
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

  switch (post.type) {
    case "video":
      return (
        <VideoPostCard
          post={post}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onLike={onLike}
          heartStyle={heartStyle}
          triggerHeart={triggerHeart}
        />
      );

    case "text":
      return (
        <TextPostCard
          post={post}
          onTogglePlay={onTogglePlay}
          onLike={onLike}
          heartStyle={heartStyle}
          triggerHeart={triggerHeart}
        />
      );

    case "carousel":
      return (
        <CarouselPostCard
          post={post}
          onLike={onLike}
          heartStyle={heartStyle}
          triggerHeart={triggerHeart}
        />
      );

    default:
      return null;
  }
}
