import { GradientBackground } from "@/components/layout/GradientBackground";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <GradientBackground>
      <StatusBar style="dark" translucent />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}
