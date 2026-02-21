// components/post/VideoPostCard.tsx

import colors from "@/constants/colors";
import { Post } from "@/types/post";
import { Play } from "@tamagui/lucide-icons";
import React, { useRef, useState } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
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
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function VideoPostCard({
  post,
  isPlaying,
  onTogglePlay,
  onLike,
  heartStyle,
  triggerHeart,
}: Props) {
  const videoRef = useRef<any>(null);

  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const progress = useSharedValue(0);
  const scrubOpacity = useSharedValue(1);
  const scrubScale = useSharedValue(1);

  const likeIconActive = require("@/assets/images/likeIcon2.png");

  const handleSeek = (newTime: number) => {
    if (!videoRef.current) return;
    videoRef.current.seek(newTime);
  };

  // const scrbAnimatedStyle = useAnimatedStyle(() => ({
  //   opacity: scrubOpacity.value,
  //   transform: [{ scale: scrubScale.value }],
  // }));

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value * (SCREEN_WIDTH * 0.9),
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
    .onStart(() => runOnJS(setPlaybackRate)(2))
    .onEnd(() => runOnJS(setPlaybackRate)(1));

  const videoGesture = Gesture.Exclusive(doubleTap, singleTap, longPress);

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
          onLoad={(d) => setVideoDuration(d.duration)}
          onProgress={(d) => {
            setCurrentTime(d.currentTime);
            if (videoDuration > 0) {
              progress.value = d.currentTime / videoDuration;
            }
          }}
        />

        {/* HEART */}
        <Animated.View
          style={[
            { position: "absolute", alignSelf: "center", top: "40%" },
            heartStyle,
          ]}
        >
          <Animated.Image source={likeIconActive} />
        </Animated.View>

        {/* PLAY ICON */}
        <View
          width={50}
          height={50}
          borderRadius={99}
          backgroundColor={"#FFF1DB"}
          position="absolute"
          justifyContent="center"
          alignItems="center"
          alignSelf="center"
          marginVertical={"100%"}
          opacity={isPlaying ? 0 : 1}
        >
          <Play size={24} color={colors.black} fill={colors.black} />
        </View>

        {/* SCRUB BAR */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 70,
              width: SCREEN_WIDTH * 0.9,
              alignSelf: "center",
            },
            // scrubAnimatedStyle,
          ]}
        >
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
                { height: "100%", backgroundColor: colors.secondary },
                progressStyle,
              ]}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}