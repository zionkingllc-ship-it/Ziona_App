import { GradientBackground } from "@/components/layout/GradientBackground";
import { FeedProvider } from "@/components/store/feedStore";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GradientBackground>
      <StatusBar style="dark" translucent />
      <FeedProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}
        >
          <FeedProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="[postId]" options={{ headerShown: false }} />
            </Stack>
          </FeedProvider>
        </SafeAreaView>
      </FeedProvider>
    </GradientBackground>
  );
}
