import { GradientBackground } from "@/components/layout/GradientBackground";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppScreen } from "@/components/layout/AppScreen";

export default function AuthLayout() {
  return (
    <GradientBackground>
      <StatusBar style="dark" translucent />
      <AppScreen>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
      </AppScreen>
    </GradientBackground>
  );
}