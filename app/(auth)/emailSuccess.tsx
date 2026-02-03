import { YStack, Text, Button } from 'tamagui'
import { router } from 'expo-router'

export default function EmailSuccess() {
  return (
    <YStack flex={1} padding="$4" gap="$4">
      <Text>Email verified 🎉</Text>

      <Button 
      //onPress={() => router.push('/(auth)/birthday')}
      >
        Continue
      </Button>
    </YStack>
  )
}
