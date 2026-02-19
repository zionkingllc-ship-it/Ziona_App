import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";
import { StatusBar } from "expo-status-bar";

import NotificationProvider from "@/providers/notificationProvider";
import config from "@/tamagui.config";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme() ?? "light";

  const [fontsLoaded] = useFonts({
    MonaSans: require("../assets/fonts/MonaSans-Regular.ttf"),
    MonaSans_SemiBold: require("../assets/fonts/MonaSans-SemiBold.ttf"),
    MonaSans_SemiBoldItalic: require("../assets/fonts/MonaSans-SemiBoldItalic.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config} defaultTheme={scheme}>
      <StatusBar style="dark" />
      <NotificationProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" /> 
            </Stack>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </NotificationProvider>
    </TamaguiProvider>
  );
}
