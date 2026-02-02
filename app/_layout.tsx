import { Stack } from 'expo-router'
import { useAuthStore } from '@/store/authStore'

export default function RootLayout() {
  const { isAuthenticated, isGuest } = useAuthStore()

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated && !isGuest ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  )
}
