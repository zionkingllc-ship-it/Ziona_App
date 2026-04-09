import React from "react";
import { View } from "react-native";
import Video from "react-native-video";

export default function TestVideo() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Video
        source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
        style={{ width: 300, height: 300 }}
        resizeMode="cover"
        repeat
        paused={false}
        onLoad={() => console.log("VIDEO LOADED")}
        onError={(e) => console.log("VIDEO ERROR", e)}
      />
    </View>
  );
}