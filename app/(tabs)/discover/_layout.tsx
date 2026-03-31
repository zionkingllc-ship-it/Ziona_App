
import { Stack } from "expo-router";

export default function DiscoverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[categoryId]" />
      <Stack.Screen name="post/[postId]" />
    </Stack>
  );
}