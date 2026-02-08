import { YStack, Button, Text } from 'tamagui'
import { router } from 'expo-router'

export default function CreatePost() {
  return (
    <YStack flex={1} padding="$4" gap="$4">
      <Text fontSize="$8" fontWeight="700">
        Create Post
      </Text>

      <Button onPress={() => router.push('/create/image')}>
        Single Image
      </Button>

      <Button onPress={() => router.push('/create/carousel')}>
        Image Carousel
      </Button>

      <Button onPress={() => router.push('/create/video')}>
        Video Post
      </Button>

      <Button onPress={() => router.push('/create/text')}>
        Text Post
      </Button>
    </YStack>
  )
}
