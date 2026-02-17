// components/post/PostMedia.tsx

import colors from "@/constants/colors";
import { Post } from "@/types/post";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Video from "react-native-video";

interface Props {
  post: Post;
  isPlaying: boolean;
  onTogglePlay?: () => void;
  onLike?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PostMedia({
  post,
  isPlaying,
  onTogglePlay,
  onLike,
}: Props) {
  const videoRef = useRef<any | null>(null);

  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const likeIconActive = require("@/assets/images/likeIcon2.png");

  function resolveSource(source?: string | number) {
    if (!source) return undefined;

    if (typeof source === "string") {
      if (source.trim() === "") return undefined;
      return { uri: source };
    }

    return source; // require(...)
  }
  /* ================= HEART ANIMATION ================= */

  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  const triggerHeart = () => {
    // Reset first
    heartScale.value = 0;
    heartOpacity.value = 1;

    // Pop up
    heartScale.value = withTiming(1.2, { duration: 180 }, () => {
      // Settle
      heartScale.value = withTiming(1, { duration: 100 }, () => {
        // Fade + shrink out
        heartScale.value = withTiming(0, { duration: 200 });
        heartOpacity.value = withTiming(0, { duration: 200 });
      });
    });
  };

  const handleLike = () => {
    if (onLike) onLike();
    triggerHeart();
  };

  /* ================= COMMON GESTURES ================= */

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      if (onTogglePlay) {
        runOnJS(onTogglePlay)();
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleLike)();
    });

  /* ================= TEXT ================= */

  if (post.type === "text") {
    const gesture = Gesture.Exclusive(doubleTap, singleTap);
    const bgSource = resolveSource(post.media?.backgroundImage);
    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
            backgroundColor: colors.black,
          }}
        >
          {bgSource && (
            <Image
              source={bgSource}
              style={{
                position: "absolute",
                width: "115%",
                height: "75%",
                borderRadius: 10,
              }}
            />
          )}
          <Animated.Text
            style={{
              color: "white",
              fontSize: 22,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {post.text}
          </Animated.Text>

          <Animated.View
            style={[
              {
                position: "absolute",
                alignSelf: "center",
                top: "40%",
              },
              heartStyle,
            ]}
          >
            <Animated.Image source={likeIconActive} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  }

  /* ================= CAROUSEL ================= */

  if (post.type === "carousel") {
    return (
      <GestureDetector gesture={doubleTap}>
        <Animated.View style={{ flex: 1 }}>
          <FlatList
            data={post.media.items}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              if (!item?.url) return null;

              const source =
                typeof item.url === "string" ? { uri: item.url } : item.url;

              return (
                <Image
                  source={source}
                  style={{
                    width: SCREEN_WIDTH,
                    height: "100%",
                    resizeMode: "cover",
                  }}
                />
              );
            }}
          />
          <Animated.View
            style={[
              {
                position: "absolute",
                alignSelf: "center",
                top: "40%",
              },
              heartStyle,
            ]}
          >
            <Animated.Image source={likeIconActive} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  }

  /* ================= IMAGE ================= */

  if (post.type === "image") {
    const gesture = Gesture.Exclusive(doubleTap, singleTap);

    const imageSource = resolveSource(post.media.url);

    if (!imageSource) return null;

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={{ flex: 1 }}>
          <Image
            source={imageSource}
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          <Animated.View
            style={[
              {
                position: "absolute",
                alignSelf: "center",
                top: "40%",
              },
              heartStyle,
            ]}
          >
            <Animated.Image source={likeIconActive} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  }
  /* ================= VIDEO ================= */

  const progress = useSharedValue(0);
  const scrubOpacity = useSharedValue(1);
  const scrubScale = useSharedValue(1);

  const fadeTimeout = useRef<NodeJS.Timeout | null>(null);
  const isUserInteracting = useRef(false);

  const resetFadeTimer = () => {
    if (fadeTimeout.current) {
      clearTimeout(fadeTimeout.current);
    }

    // Only auto fade if video is playing
    if (isPlaying && !isUserInteracting.current) {
      fadeTimeout.current = setTimeout(() => {}, 2000);
    }
  };

  const handleSeek = (newTime: number) => {
    if (!videoRef.current) return;
    if (isNaN(newTime) || newTime < 0) return;

    videoRef.current.seek(newTime);
  };
  const scrubAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scrubOpacity.value,
    transform: [{ scale: scrubScale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value * (SCREEN_WIDTH * 0.9),
  }));

  const scrubPan = Gesture.Pan()
    .onBegin(() => {
      isUserInteracting.current = true;

      scrubScale.value = withTiming(1.05, { duration: 120 });
    })
    .onUpdate((e) => {
      if (videoDuration <= 0) return;
      const trackWidth = SCREEN_WIDTH * 0.9;
      // Clamp position properly
      const clampedX = Math.max(0, Math.min(e.x, trackWidth));
      const percent = clampedX / trackWidth;
      // Clamp percent too (double safety)
      const safePercent = Math.max(0, Math.min(1, percent));
      progress.value = safePercent;
      const newTime = safePercent * videoDuration;

      if (!isNaN(newTime) && newTime >= 0) {
        runOnJS(handleSeek)(newTime);
      }
    })
    .onFinalize(() => {
      scrubScale.value = withTiming(1, { duration: 120 });
      isUserInteracting.current = false;
      // Start a fade timer after user interaction ends
      if (isPlaying) {
        // Keep it visible initially
        scrubOpacity.value = withTiming(1, { duration: 100 }); 
      }
    });

  const longPress = Gesture.LongPress()
    .minDuration(250)
    .onStart(() => {
      runOnJS(setPlaybackRate)(2);
    })
    .onEnd(() => {
      runOnJS(setPlaybackRate)(1);
    });

  const pan = Gesture.Pan().onUpdate((e) => {
    if (videoDuration > 0) {
      const percent = e.translationX / SCREEN_WIDTH;
      const newTime = Math.max(
        0,
        Math.min(videoDuration, currentTime + percent * videoDuration),
      );
      runOnJS(handleSeek)(newTime);
    }
  });

  const videoGesture = Gesture.Exclusive(doubleTap, singleTap, longPress, pan);

  return (
    <GestureDetector gesture={videoGesture}>
      <Animated.View style={{ flex: 1 }}>
        <Video
          ref={videoRef}
          source={{ uri: post.media.videoUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          repeat
          rate={playbackRate}
          paused={!isPlaying}
          onLoad={(data) => {
            setVideoDuration(data.duration);
          }}
          onProgress={(data) => {
            setCurrentTime(data.currentTime);

            if (videoDuration > 0) {
              progress.value = data.currentTime / videoDuration;
            }

            // If video completes → keep scrub visible
            if (videoDuration > 0 && data.currentTime >= videoDuration - 0.2) {
            }
          }}
        />

        {/* HEART */}
        <Animated.View
          style={[
            {
              position: "absolute",
              alignSelf: "center",
              top: "40%",
            },
            heartStyle,
          ]}
        >
          <Animated.Image source={likeIconActive} />
        </Animated.View>

        {/* SCRUB BAR */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 70,
              width: SCREEN_WIDTH * 0.9,
              alignSelf: "center",
            },
            scrubAnimatedStyle,
          ]}
        >
          <GestureDetector gesture={scrubPan}>
            <Animated.View
              style={{
                height: 7,
                backgroundColor: colors.white,
                overflow: "hidden",
                top: 36,
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
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
