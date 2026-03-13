import { Stack } from "expo-router";

export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="media" />
      <Stack.Screen name="text" />
      <Stack.Screen name="tag" />
      <Stack.Screen name="preview" />

      <Stack.Screen name="bible/translation" />
      <Stack.Screen name="bible/books" />
      <Stack.Screen name="bible/chapter" />
      <Stack.Screen name="bible/verse" />
    </Stack>
  );
}
