import colors from "@/constants/colors";
import { FeedMediaPost } from "@/types/feedTypes";
import { Play } from "@tamagui/lucide-icons";
import React, { useRef, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Video from "react-native-video";
import { Text, View } from "tamagui";

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
  const [rate, setRate] = useState<number>(1);
  const likeIconActive = require("@/assets/images/likeIcon2.png");

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value * (screenWidth * 0.9),
  }));

  /* =========================
     GESTURES 
  ========================= */

  let singleTapTimeout: any = null;
  let doubleTapTriggered = false;

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd((_, success) => {
      if (!success) return;

      singleTapTimeout = setTimeout(() => {
        if (!doubleTapTriggered && onTogglePlay) {
          runOnJS(onTogglePlay)();
        }
        doubleTapTriggered = false; // reset
      }, 200);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      doubleTapTriggered = true;
    })
    .onEnd((_, success) => {
      if (!success) return;

      if (singleTapTimeout) {
        clearTimeout(singleTapTimeout);
        singleTapTimeout = null;
      }

      if (onLike) runOnJS(onLike)();
      runOnJS(triggerHeart)();
    });

  const longPress = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      runOnJS(setRate)(2);
    })
    .onEnd(() => {
      runOnJS(setRate)(1);
    });

  const videoGesture = Gesture.Simultaneous(singleTap, doubleTap, longPress);

  /* =========================
     VIDEO
  ========================= */

  const videoItem = post.media?.[0];
  const videoUrl =
    videoItem && videoItem.type === "video" ? videoItem.url : undefined;

  if (!videoUrl) {
    console.log("No video URL:", post);
    return null;
  }

  const scrubHeight = 7;
  const playButtonSize = Math.min(50, screenWidth * 0.12);

  return (
    <GestureDetector gesture={videoGesture}>
      <Animated.View
        style={{
          flex: 1,
          width: screenWidth,
          height: screenHeight,
        }}
      >
        <Video
          ref={videoRef}
          rate={rate}
          source={{ uri: videoUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          repeat
          paused={!isPlaying}
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
        {rate === 2 && (
          <View position="absolute" top={screenHeight * 0.1} alignSelf="center">
            <Text color="white" fontSize={14}>
              2x
            </Text>
          </View>
        )}
        {/*LIKE ANIMATION */}
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
            source={likeIconActive}
            style={{ width: 80, height: 80 }}
          />
        </Animated.View>

        {/* PLAY BUTTON */}
        {!isPlaying && (
          <View
            width={playButtonSize}
            height={playButtonSize}
            borderRadius={playButtonSize / 2}
            backgroundColor="#FFF1DB"
            position="absolute"
            justifyContent="center"
            alignItems="center"
            alignSelf="center"
            top={screenHeight * 0.45}
            pointerEvents="none"
          >
            <Play
              size={playButtonSize * 0.5}
              color={colors.black}
              fill={colors.black}
            />
          </View>
        )}

        {/*PROGRESS BAR */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            width: screenWidth,
            height: scrubHeight,
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
