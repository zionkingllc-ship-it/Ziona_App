import colors from "@/constants/colors";
import { FeedMediaPost } from "@/types/feedTypes";
import { Play } from "@tamagui/lucide-icons";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Video from "react-native-video";
import { View } from "tamagui";
import { useFocusEffect } from "@react-navigation/native";

interface Props {
  post: FeedMediaPost;
  isPlaying: boolean;
  onTogglePlay?: () => void;
  onLike?: () => void;
  heartStyle: any;
  triggerHeart: () => void;
  screenWidth: number;
  screenHeight: number;
  tabBarHeight: number;
}

export default function VideoPostCard({
  post,
  isPlaying,
  onTogglePlay,
  onLike,
  heartStyle,
  triggerHeart,
  screenWidth,
  screenHeight,
}: Props) {
  const videoRef = useRef<any>(null);

  const [videoDuration, setVideoDuration] = useState(0);
  const progress = useSharedValue(0);

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value * (screenWidth * 0.9),
  }));

  /* ================= SAFE NAVIGATION HANDLING ================= */

  useFocusEffect(
    useCallback(() => {
      return () => {
        // 🔥 DO NOTHING IMPERATIVE
        // playback is controlled via `paused` prop only
      };
    }, [])
  );

  /* ================= SAFE CLEANUP ================= */

  useEffect(() => {
    return () => {
      // 🔥 NO imperative calls here
      // letting React unmount cleanly with paused state
    };
  }, []);

  /* ================= GESTURES ================= */

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .onEnd(() => {
      if (onLike) runOnJS(onLike)();
      runOnJS(triggerHeart)();
    });

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .maxDelay(250)
    .onEnd(() => {
      if (onTogglePlay) runOnJS(onTogglePlay)();
    });

  const gesture = Gesture.Exclusive(doubleTap, singleTap);

  /* ================= VIDEO ================= */

  const videoItem = post.media?.[0];
  const videoUrl =
    videoItem && videoItem.type === "video" ? videoItem.url : undefined;

  if (!videoUrl) return null;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={{
          flex: 1,
          width: screenWidth,
          height: screenHeight,
        }}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
          repeat

          // 🔥 ONLY CONTROL POINT
          paused={!isPlaying}

          // 🔥 CRITICAL ANDROID FIX
          useTextureView={true}
          useSecureView={false}

          onLoad={(d) => {
            setVideoDuration(d.duration);
          }}

          onProgress={(d) => {
            if (videoDuration > 0) {
              progress.value = d.currentTime / videoDuration;
            }
          }}

          onError={(error) => {
            console.error("Video playback error:", error);
          }}
        />

        {/* LIKE ANIMATION */}
        <Animated.View
          style={[
            {
              position: "absolute",
              alignSelf: "center",
              top: screenHeight * 0.4,
            },
            heartStyle,
          ]}
        >
          <Animated.Image
            source={require("@/assets/images/likeIcon2.png")}
            style={{ width: 80, height: 80 }}
          />
        </Animated.View>

        {/* PLAY BUTTON */}
        {!isPlaying && (
          <View
            width={50}
            height={50}
            borderRadius={25}
            backgroundColor="#FFF1DB"
            position="absolute"
            justifyContent="center"
            alignItems="center"
            alignSelf="center"
            top={screenHeight * 0.45}
            pointerEvents="none"
          >
            <Play size={24} color={colors.black} fill={colors.black} />
          </View>
        )}

        {/* PROGRESS BAR */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            width: screenWidth,
            height: 6,
            backgroundColor: "rgba(255,255,255,0.3)",
            overflow: "hidden",
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
      </Animated.View>
    </GestureDetector>
  );
}