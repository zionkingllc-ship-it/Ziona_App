import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";

import NotificationProvider from "@/providers/notificationProvider";
import config from "@/tamagui.config";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme() ?? "light";

  const [fontsLoaded] = useFonts({
    MonaSans_400: require("../assets/fonts/MonaSans-Regular.ttf"),
    MonaSans_500: require("../assets/fonts/MonaSans-Medium.ttf"),
    MonaSans_600: require("../assets/fonts/MonaSans-SemiBold.ttf"),
    MonaSans_700: require("../assets/fonts/MonaSans-Bold.ttf"),
    EBGaramond_400: require("../assets/fonts/EBGaramond-Regular.ttf"),
    EBGaramond_500: require("../assets/fonts/EBGaramond-Medium.ttf"),
    EBGaramond_600: require("../assets/fonts/EBGaramond-SemiBold.ttf"),
    EBGaramond_400_Italic: require("../assets/fonts/EBGaramond-Italic.ttf"),

    Merienda_400: require("../assets/fonts/Merienda-Regular.ttf"),
    Merienda_500: require("../assets/fonts/Merienda-Medium.ttf"),
    Merienda_600: require("../assets/fonts/Merienda-SemiBold.ttf"),
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
    <TamaguiProvider config={config} defaultTheme={scheme} disableInjectCSS>
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
