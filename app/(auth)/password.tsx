import { YStack, Input, Button, Text } from 'tamagui'
import { useAuthStore } from '@/store/authStore'
import { router } from 'expo-router'
import { useState } from 'react'

export default function Password() {
  const [password, setPassword] = useState('')
  const login = useAuthStore((s) => s.login)

  const handleCreate = async () => {
    // TODO: backend call
    await login('fake-jwt-token')
   // router.replace('/(tabs)/feed')
  }

  return (
    <YStack flex={1} padding="$4" gap="$4">
      <Text>Create password</Text>

      <Input
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button onPress={handleCreate}>
        Create account
      </Button>
    </YStack>
  )
}
