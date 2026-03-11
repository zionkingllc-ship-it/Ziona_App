import colors from "@/constants/colors";
import { useScreenDimensions } from "@/context/ScreenDimensionsContext";
import { Post } from "@/types/post";
import { Play } from "@tamagui/lucide-icons";
import React, { useRef, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Video from "react-native-video";
import { View } from "tamagui";

interface Props {
  post: Post;
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
  tabBarHeight,
}: Props) {
  const videoRef = useRef<any>(null); 

  const [videoDuration, setVideoDuration] = useState(0);
  const playbackRate = useSharedValue(1);
  const progress = useSharedValue(0);

  const likeIconActive = require("@/assets/images/likeIcon2.png");

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value * (screenWidth * 0.9),
  }));

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      if (onTogglePlay) runOnJS(onTogglePlay)();
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (onLike) runOnJS(onLike)();
      runOnJS(triggerHeart)();
    });

  const longPress = Gesture.LongPress()
    .minDuration(250)
    .onStart(() => {
      playbackRate.value = 2;
    })
    .onEnd(() => {
      playbackRate.value = 1;
    });

  const videoGesture = Gesture.Exclusive(doubleTap, singleTap, longPress);

  //  SCRUB BAR POSITION — ALWAYS ABOVE TAB BAR
  const scrubBottom = 0;

  const scrubWidth = screenWidth * 0.9;
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
          source={{ uri: post.media?.videoUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
          repeat
          rate={playbackRate.value}
          paused={!isPlaying}
          onLoad={(d) => setVideoDuration(d.duration)}
          onProgress={(d) => {
            if (videoDuration > 0) {
              progress.value = d.currentTime / videoDuration;
            }
          }}
          onError={(error) => console.error("Video playback error:", error)}
        />

        {/* HEART ANIMATION */}
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
          opacity={isPlaying ? 0 : 1}
          pointerEvents="none"
        >
          <Play
            size={playButtonSize * 0.5}
            color={colors.black}
            fill={colors.black}
          />
        </View>

        {/* SCRUB BAR (VIDEO ONLY) */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: scrubBottom,
            width: scrubWidth,
            alignSelf: "center",
            height: scrubHeight,
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: scrubHeight / 2,
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
