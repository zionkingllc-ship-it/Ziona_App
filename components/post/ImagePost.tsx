
// components/post/ImagePost.tsx
import { Image } from 'expo-image'
import { YStack, Text } from 'tamagui'
import { Post } from '@/types/post'

export function ImagePost({ post }: { post: Post }) {
  return (
    <YStack flex={1}>
      <Image
        source={{ uri: post.content.images?.[0] }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
      />

      {/* Text overlay */}
      {post.content.text && (
        <YStack
          position="absolute"
          bottom={80}
          left={16}
          right={80}
        >
          <Text color="white" fontSize="$5">
            {post.content.text}
          </Text>
        </YStack>
      )}
    </YStack>
  )
}
