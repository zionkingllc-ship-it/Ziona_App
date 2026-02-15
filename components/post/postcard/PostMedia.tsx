// components/post/PostMedia.tsx

import React, { useRef, useState } from "react";
import { Image } from "react-native";
import Video from "react-native-video";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { Post } from "@/types/post";

interface Props {
  post: Post;
  isPlaying: boolean;
  playbackRate?: number;
  videoGesture?: any;
  progress?: any;
}

export default function PostMedia({
  post,
  isPlaying,
  playbackRate = 1,
  videoGesture,
}: Props) {
  const videoRef = useRef<any>(null);
  const [duration, setDuration] = useState(0);

  /* ================= TEXT ================= */

  if (post.type === "text") {
    return null;
  }

  /* ================= CAROUSEL ================= */

  if (post.type === "carousel") {
    return (
      <Image
        source={{ uri: post.media[0]?.url }}
        style={{ width: "100%", height: "100%", resizeMode: "cover" }}
      />
    );
  }

  /* ================= VIDEO ================= */

  if (post.type === "video") {
    const videoElement = (
      <Animated.View style={{ flex: 1 }}>
        <Video
          ref={videoRef}
          source={{ uri: post.media.url }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          repeat
          paused={!isPlaying}
          rate={playbackRate}
          controls={false}
          progressUpdateInterval={100}
          onLoad={(data) => setDuration(data.duration)}
          playInBackground={false}
          ignoreSilentSwitch="ignore"
        />
      </Animated.View>
    );

    //  SAFE GUARD
    if (videoGesture) {
      return (
        <GestureDetector gesture={videoGesture}>
          {videoElement}
        </GestureDetector>
      );
    }

    return videoElement;
  }

  /* ================= IMAGE ================= */

  return (
    <Image
      source={{ uri: post.media.url }}
      style={{
        width: "100%",
        height: "100%",
        resizeMode: "cover",
      }}
    />
  );
}