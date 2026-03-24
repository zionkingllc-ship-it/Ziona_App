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
 
  switch (post.type) {
    case "media": {
      // IMAGE
      if (post.mediaType === "image") {
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

      // VIDEO
      if (post.mediaType === "video") {
        return (
          <VideoPostCard
            post={post}
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

      return null;
    }

    case "text":
      return (
        <TextPostCard
          post={post}
          onTogglePlay={onTogglePlay}
          onLike={onLike}
          heartStyle={heartStyle}
          triggerHeart={triggerHeart}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        />
      );

    case "bible":
      // reuse text renderer for now
      return (
        <TextPostCard
          post={post}
          onTogglePlay={onTogglePlay}
          onLike={onLike}
          heartStyle={heartStyle}
          triggerHeart={triggerHeart}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        />
      );

    default:
      return null;
  }
}