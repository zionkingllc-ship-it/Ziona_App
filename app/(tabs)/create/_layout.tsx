import { Stack } from 'expo-router'

export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}
    />
  )
}
