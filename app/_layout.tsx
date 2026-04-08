import AuthGate from "@/components/auth/AuthGate";
import colors from "@/constants/colors";
import { ScreenDimensionsProvider } from "@/context/ScreenDimensionsContext";
import { debugAuthStorage } from "@/helpers/asyncDataLog";
import { queryClient } from "@/lib/queryClient";
import NotificationProvider from "@/providers/notificationProvider";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/useAuthStore";
import config from "@/tamagui.config";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const scheme = useColorScheme() ?? "light";
  const loadCategories = useCategoryStore((s) => s.loadCategories);

  /* -------- WAIT FOR HYDRATION -------- */

  useEffect(() => {
    if (!hasHydrated) {
      console.log("[APP] ⏳ Waiting for auth hydration...");
      return;
    }

    console.log("[APP] ✅ Auth hydrated, initializing");

    loadCategories();
    initializeAuth();
  }, [hasHydrated]);

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

  /* -------- NAV BAR -------- */

  useEffect(() => {
    NavigationBar.setButtonStyleAsync("dark");
  }, []);

  /* -------- SPLASH -------- */

  useEffect(() => {
    if (fontsLoaded && hasHydrated) {
      console.log("[APP] 🚀 App ready, hiding splash");

      SplashScreen.hideAsync();
      debugAuthStorage();
    }
  }, [fontsLoaded, hasHydrated]);

  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);

  if (!fontsLoaded || !hasHydrated || isBootstrapping) {
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
                <AuthGate>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                  </Stack>
                </AuthGate>
              </QueryClientProvider>
            </GestureHandlerRootView>
          </NotificationProvider>
        </TamaguiProvider>
      </ScreenDimensionsProvider>
    </SafeAreaProvider>
  );
}