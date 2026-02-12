import colors from "@/constants/colors";
import { Post } from "@/types/post";
import { Play } from "@tamagui/lucide-icons";
import React, { useEffect, useRef, useState } from "react";
import { View as RNView } from "react-native";
import Video from "react-native-video";
import { Image, Text, View, XStack, YStack } from "tamagui";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";

type Props = {
  post: Post;
  isActive?: boolean;
  screenHeight: number;
};

const likeIcon = require("@/assets/images/likeIcon.png");
const likeIconActive = require("@/assets/images/likeIcon2.png");
const commentIcon = require("@/assets/images/commentIcon.png");
const bookmarkIcon = require("@/assets/images/bookmarkIcon.png");
const shareIcon = require("@/assets/images/shareIcon.png");
const flagIcon = require("@/assets/images/flagIcon.png");

export function PostCard({ post, isActive, screenHeight }: Props) {
  const videoRef = useRef<any>(null);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [liked, setLiked] = useState(false);

  const progressWidthRef = useRef(0);
  const lastRatioRef = useRef(0);

  /* =========================
     AUTO PLAY / PAUSE
  ========================== */
  useEffect(() => {
    if (post.type !== "video") return;

    if (isActive) {
      setIsPlaying(true);
      setShowPlayIcon(false);
    } else {
      setIsPlaying(false);
      setShowPlayIcon(true);
    }
  }, [isActive, post.type]);

  /* =========================
     VIDEO CONTROLS
  ========================== */

  const handleSingleTap = () => {
    if (post.type !== "video") return;

    setIsPlaying((prev) => {
      const next = !prev;
      setShowPlayIcon(!next);
      return next;
    });
  };

  const handleDoubleTap = () => {
    setLiked(true);
  };

  const handleLongPressStart = () => {
    if (post.type !== "video") return;
    if (!videoRef.current) return;

    videoRef.current.setNativeProps({
      rate: 2.0,
    });
  };

  const handleLongPressEnd = () => {
    if (post.type !== "video") return;
    if (!videoRef.current) return;

    videoRef.current.setNativeProps({
      rate: 1.0,
    });
  };

  const handleSeek = (ratio: number) => {
    if (!videoRef.current) return;
    if (!duration) return;

    const newTime = ratio * duration;

    videoRef.current.seek(newTime);
  };

  /* =========================
     GESTURES
  ========================== */

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => runOnJS(handleDoubleTap)());

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => runOnJS(handleSingleTap)());

  const longPress = Gesture.LongPress()
    .minDuration(250)
    .onStart(() => runOnJS(handleLongPressStart)())
    .onEnd(() => runOnJS(handleLongPressEnd)());

  const videoGesture = Gesture.Exclusive(
    doubleTap,
    Gesture.Simultaneous(longPress, singleTap)
  );

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (!progressWidthRef.current) return;

      const ratio = Math.max(
        0,
        Math.min(1, e.x / progressWidthRef.current)
      );

      lastRatioRef.current = ratio;
      runOnJS(setProgress)(ratio);
    })
    .onEnd(() => {
      runOnJS(handleSeek)(lastRatioRef.current);
    });

  return (
    <YStack height={screenHeight} width="100%" backgroundColor="black">
      <GestureDetector gesture={videoGesture}>
        <Animated.View style={{ flex: 1 }}>
          {post.type === "video" && (
            <>
              <Video
                ref={videoRef}
                source={{ uri: post.media.url }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                repeat
                paused={!isPlaying}
                rate={1.0}
                onLoad={(data) => {
                  setDuration(data.duration);
                }}
                onProgress={(data) => {
                  if (!duration) return;
                  setProgress(
                    data.currentTime / data.seekableDuration
                  );
                }}
                progressUpdateInterval={250}
              />

              {showPlayIcon && (
                <View
                  position="absolute"
                  top="50%"
                  left="50%"
                  style={{
                    transform: [{ translateX: -30 }, { translateY: -30 }],
                  }}
                  width={60}
                  height={60}
                  borderRadius={30}
                  backgroundColor="#FFF1DB"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Play size={30} color="black" fill="black" />
                </View>
              )}
            </>
          )}

          {post.type === "image" && (
            <Image
              source={{ uri: post.media.url }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
          )}
        </Animated.View>
      </GestureDetector>

      {/* Overlay */}
      <YStack position="absolute" bottom={34} width="100%">
        <XStack padding="$4" alignItems="flex-end">
          <YStack flex={1} gap="$2">
            <Text color="white">@{post.author.name}</Text>
            {post.caption && (
              <Text color="white">{post.caption}</Text>
            )}
          </YStack>

          <YStack gap="$4" alignItems="center">
            <Image
              source={liked ? likeIconActive : likeIcon}
              width={24}
              height={24}
            />
            <Image source={commentIcon} width={24} height={24} />
            <Image source={bookmarkIcon} width={24} height={24} />
            <Image source={shareIcon} width={24} height={24} />
            <Image source={flagIcon} width={24} height={24} />
          </YStack>
        </XStack>

        {/* Progress Bar */}
        {post.type === "video" && (
          <GestureDetector gesture={panGesture}>
            <Animated.View
              onLayout={(e) => {
                progressWidthRef.current =
                  e.nativeEvent.layout.width;
              }}
              style={{
                height: 6,
                backgroundColor: "white",
                width: "100%",
              }}
            >
              <RNView
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  backgroundColor: colors.secondary,
                }}
              />
            </Animated.View>
          </GestureDetector>
        )}
      </YStack>
    </YStack>
  );
}