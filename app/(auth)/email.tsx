import { YStack, Input, Button, Text } from 'tamagui'
import { router } from 'expo-router'
import { useState } from 'react'

export default function Email() {
  const [email, setEmail] = useState('')

  const handleNext = () => {
    // TODO: call backend
    // router.push('/(auth)/emailSuccess')
  }

  return (
    <YStack flex={1} padding="$4" gap="$4">
      <Text>Your email address</Text>

      <Input
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Button onPress={handleNext} disabled={!email}>
        Next
      </Button>
    </YStack>
  )
}
