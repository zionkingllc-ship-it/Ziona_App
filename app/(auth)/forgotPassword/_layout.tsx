import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function forgotLayout() {
  return (
    <>
      <StatusBar style="dark" translucent /> 
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
    </>
  );
}
