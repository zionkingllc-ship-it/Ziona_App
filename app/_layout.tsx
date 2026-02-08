import { Stack } from 'expo-router'
import { TamaguiProvider } from 'tamagui'
import { useColorScheme } from 'react-native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import config from '@/tamagui.config'
import NotificationProvider from '@/providers/notificationProvider'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'light'

 const [fontsLoaded] = useFonts({
  MonaSans: require('../assets/fonts/MonaSans-Regular.ttf'),
  MonaSans_SemiBold: require('../assets/fonts/MonaSans-SemiBold.ttf'),
  MonaSans_SemiBoldItalic: require('../assets/fonts/MonaSans-SemiBoldItalic.ttf'),
})

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <TamaguiProvider config={config} defaultTheme={scheme}>
      <NotificationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </NotificationProvider>
    </TamaguiProvider>
  )
}