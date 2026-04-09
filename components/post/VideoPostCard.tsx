import { FeedMediaPost } from "@/types/feedTypes";
import React, { useState } from "react";
import Video from "react-native-video";
import { Platform } from "react-native";
import Animated, { runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type VideoPost = Extract<FeedMediaPost, { mediaType: "video" }>;

interface Props {
  post: VideoPost;
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
  const videoUrl = post.media[0].url;

  const [useTexture, setUseTexture] = useState(
    Platform.OS === "android" ? false : true,
  );

  console.log("VIDEO URL:", videoUrl);
  console.log("IS PLAYING:", isPlaying);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (onLike) runOnJS(onLike)();
      runOnJS(triggerHeart)();
    });

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      if (onTogglePlay) runOnJS(onTogglePlay)();
    });

  const gesture = Gesture.Exclusive(doubleTap, singleTap);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={{
          width: screenWidth,
          height: screenHeight,
          backgroundColor: "black",
        }}
      >
        <Video
          source={{ uri: videoUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          repeat
          paused={!isPlaying} // 🔥 CRITICAL
          useTextureView={useTexture}
          onLoad={() => console.log("VIDEO LOADED")}
          onBuffer={(e) => console.log("BUFFER", e)}
          onError={(e) => {
            console.log("VIDEO ERROR → switching surface", e);
            setUseTexture((prev) => !prev);
          }}
        />

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
      </Animated.View>
    </GestureDetector>
  );
}