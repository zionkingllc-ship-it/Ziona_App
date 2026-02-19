import { FeedProvider } from "@/components/store/FeedStore";
import { Stack } from "expo-router";

export default function DiscoverLayout() {
  return (
    <FeedProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[postId]" />
      </Stack>
    </FeedProvider>
  );
}
