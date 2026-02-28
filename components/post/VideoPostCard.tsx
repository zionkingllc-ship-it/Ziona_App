import colors from "@/constants/colors";
import { Post } from "@/types/post";
import { Play } from "@tamagui/lucide-icons";
import React, { useRef, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Video from "react-native-video";
import { View } from "tamagui";
import { useScreenDimensions } from "@/context/ScreenDimensionsContext";

interface Props {
  post: Post;
  isPlaying: boolean;
  onTogglePlay?: () => void;
  onLike?: () => void;
  heartStyle: any;
  triggerHeart: () => void;
  screenWidth: number;
  screenHeight: number;
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
  const { wp, hp } = useScreenDimensions();
  
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const progress = useSharedValue(0);

  const likeIconActive = require("@/assets/images/likeIcon2.png");

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value * (screenWidth * 0.9),
  }));

  const singleTap = Gesture.Tap().numberOfTaps(1).onEnd(() => {
    if (onTogglePlay) runOnJS(onTogglePlay)();
  });

  const doubleTap = Gesture.Tap().numberOfTaps(2).onEnd(() => {
    if (onLike) runOnJS(onLike)();
    runOnJS(triggerHeart)();
  });

  const longPress = Gesture.LongPress()
    .minDuration(250)
    .onStart(() => runOnJS(setPlaybackRate)(2))
    .onEnd(() => runOnJS(setPlaybackRate)(1));

  const videoGesture = Gesture.Exclusive(doubleTap, singleTap, longPress);

  const playButtonSize = Math.min(50, wp(12));
  const scrubBarBottom = hp(8);

  return (
    <GestureDetector gesture={videoGesture}>
      <Animated.View style={{ flex: 1, width: screenWidth, height: screenHeight }}>
        <Video
          ref={videoRef}
          source={{ uri: post.media?.videoUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          repeat
          rate={playbackRate}
          paused={!isPlaying}
          onLoad={(d) => setVideoDuration(d.duration)}
          onProgress={(d) => {
            setCurrentTime(d.currentTime);
            if (videoDuration > 0) progress.value = d.currentTime / videoDuration;
          }}
          onError={(error) => console.error("Video playback error:", error)}
        />

        <Animated.View style={[{ position: "absolute", alignSelf: "center", top: screenHeight * 0.4 }, heartStyle]}>
          <Animated.Image source={likeIconActive} style={{ width: 80, height: 80 }} />
        </Animated.View>

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
          <Play size={playButtonSize * 0.5} color={colors.black} fill={colors.black} />
        </View>

        <Animated.View
          style={{
            position: "absolute",
            bottom: scrubBarBottom,
            width: wp(90),
            alignSelf: "center",
            height: 7,
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: 3.5,
            overflow: "hidden",
          }}
        >
          <Animated.View style={[{ height: "100%", backgroundColor: colors.secondary }, progressStyle]} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}