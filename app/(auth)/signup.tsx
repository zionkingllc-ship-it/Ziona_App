import { YStack, Text, Button } from 'tamagui'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/authStore'

export default function SignUp() {
  const setGuest = useAuthStore((s) => s.setGuest)

  const handleSkip = async () => {
    await setGuest()
   // router.replace('/(tabs)/feed')
  }

  return (
    <YStack flex={1} padding="$4" justifyContent="space-between">
      <YStack gap="$4">
        <Text fontSize="$8" fontWeight="700">
          Sign up for Zion
        </Text>

        <Button 
        //onPress={() => router.push('/(auth)/email')}
            >
          Continue with Email
        </Button>

        {/* socials later */}
      </YStack>

      <Button
        chromeless
        onPress={handleSkip}
      >
        Skip for now
      </Button>
    </YStack>
  )
}
