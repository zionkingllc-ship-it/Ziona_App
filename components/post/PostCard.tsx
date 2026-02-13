import colors from "@/constants/colors";
import { Post } from "@/types/post";
import { Heart, Play } from "@tamagui/lucide-icons";
import React, { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import { Image, Text, View, XStack, YStack } from "tamagui";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Video from "react-native-video";

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
  const videoRef = useRef<Video>(null);
  const progressBarRef = useRef<any>(null);

  /* =========================
     STATE
  ========================== */
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  /* =========================
     SHARED VALUES
  ========================== */
  const progress = useSharedValue(0);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const progressLayoutRef = useRef({
    width: 0,
    pageX: 0,
  });

  const isDraggingRef = useRef(false);
  const lastRatioRef = useRef(0);
  const durationRef = useRef(0);

  /* =========================
     AUTOPLAY (FEED SAFE)
  ========================== */
  useEffect(() => {
    setIsPlaying(!!isActive);
  }, [isActive]);

  /* =========================
     PLAY / PAUSE
  ========================== */
  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  /* =========================
     DOUBLE TAP LIKE + HEART
  ========================== */
  const handleDoubleTap = () => {
    setLiked(true);

    heartOpacity.value = 1;
    heartScale.value = 0;

    heartScale.value = withSpring(1.2, { damping: 8 }, () => {
      heartScale.value = withTiming(1, { duration: 120 });
    });

    heartOpacity.value = withTiming(0, { duration: 700 });
  };

  /* =========================
     LONG PRESS 2X SPEED
  ========================== */
  const handleLongPressStart = () => {
    setPlaybackRate(2);
  };

  const handleLongPressEnd = () => {
    setPlaybackRate(1);
  };

  /* =========================
     SEEK
  ========================== */
  const handleSeek = (ratio: number) => {
    if (!videoRef.current || !duration) return;

    const newTime = ratio * duration;

    const wasPlaying = isPlaying;

    if (wasPlaying) {
      setIsPlaying(false);
    }

    videoRef.current.seek(newTime);

    if (wasPlaying) {
      setTimeout(() => {
        setIsPlaying(true);
      }, 50);
    }
  };

  /* =========================
     GESTURES
  ========================== */

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => runOnJS(handleDoubleTap)());

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .maxDelay(250)
    .onStart(() => runOnJS(togglePlayback)());

  const longPress = Gesture.LongPress()
    .minDuration(250)
    .onStart(() => runOnJS(handleLongPressStart)())
    .onEnd(() => runOnJS(handleLongPressEnd)());

  const videoGesture = Gesture.Exclusive(
    doubleTap,
    Gesture.Simultaneous(longPress, singleTap),
  );

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDraggingRef.current = true;
    })
    .onUpdate((e) => {
      const { width, pageX } = progressLayoutRef.current;

      if (!width) return;

      const fingerX = e.absoluteX;
      const relativeX = fingerX - pageX;

      const ratio = Math.max(0, Math.min(1, relativeX / width));

      progress.value = ratio;
      lastRatioRef.current = ratio;
    })
    .onEnd(() => {
      isDraggingRef.current = false;
      runOnJS(handleSeek)(lastRatioRef.current);
    });

  /* =========================
     ANIMATED STYLES
  ========================== */

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.value,
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <YStack height={screenHeight} width="100%" backgroundColor="black">
      {/* VIDEO + TAP GESTURES */}
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
                controls={false}
                paused={!isPlaying}
                rate={playbackRate}
                progressUpdateInterval={100}
                onLoad={(data) => {
                  durationRef.current = data.duration;
                }}
                onProgress={(data) => {
                  if (isDraggingRef.current) return;

                  const total = data.seekableDuration;

                  if (total > 0) {
                    progress.value = data.currentTime / total;
                    setDuration(total);
                  }
                }}
                playInBackground={false}
                ignoreSilentSwitch="ignore"
              />

              {/* Heart Animation */}
              <Animated.View
                pointerEvents="none"
                style={[
                  {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginLeft: -50,
                    marginTop: -50,
                  },
                  heartStyle,
                ]}
              >
                <Heart
                  size={90}
                  fill={colors.secondary}
                  color={colors.secondary}
                />
              </Animated.View>

              {/* Play Icon */}
              {!isPlaying && (
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

      {/* OVERLAY */}
      <YStack position="absolute" bottom={34} width="100%">
        <XStack padding="$4" alignItems="flex-end">
          <YStack flex={1} gap="$2">
            <Text color="white">@{post.author.name}</Text>
            {post.caption && <Text color="white">{post.caption}</Text>}
          </YStack>

          <YStack gap="$4" alignItems="center">
            <Pressable onPress={() => setLiked((p) => !p)}>
              <Image
                source={liked ? likeIconActive : likeIcon}
                width={24}
                height={24}
              />
            </Pressable>
            <Pressable>
              <Image source={commentIcon} width={24} height={24} />
            </Pressable>
            <Pressable>
              <Image source={bookmarkIcon} width={24} height={24} />
            </Pressable>
            <Pressable>
              <Image source={shareIcon} width={24} height={24} />
            </Pressable>
            <Pressable>
              <Image source={flagIcon} width={24} height={24} />
            </Pressable>
          </YStack>
        </XStack>

        {/* SEEK BAR */}
        {post.type === "video" && (
          <GestureDetector gesture={panGesture}>
            <Animated.View
              ref={progressBarRef}
              onLayout={() => {
                progressBarRef.current?.measure(
                  (x, y, width, height, pageX) => {
                    progressLayoutRef.current = { width, pageX };
                  },
                );
              }}
              style={{
                height: 6,
                backgroundColor: "white",
                width: "100%",
              }}
            >
              <Animated.View
                style={[
                  {
                    height: "100%",
                    backgroundColor: colors.secondary,
                  },
                  progressStyle,
                ]}
              />
            </Animated.View>
          </GestureDetector>
        )}
      </YStack>
    </YStack>
  );
}
