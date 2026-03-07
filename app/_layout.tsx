import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";

import { ScreenDimensionsProvider } from "@/context/ScreenDimensionsContext";
import NotificationProvider from "@/providers/notificationProvider";
import { useAuthStore } from "@/store/useAuthStore";
import config from "@/tamagui.config";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme() ?? "light";
  const segments = useSegments();

  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

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
    if (fontsLoaded && !isBootstrapping) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isBootstrapping]);

  /* -------- AUTH REDIRECT GUARD -------- */

  useEffect(() => {
    if (isBootstrapping) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)");
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/feed");
    }
  }, [isAuthenticated, isBootstrapping, segments]);

  if (!fontsLoaded || isBootstrapping) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ScreenDimensionsProvider>
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
      </ScreenDimensionsProvider>
    </SafeAreaProvider>
  );
}
