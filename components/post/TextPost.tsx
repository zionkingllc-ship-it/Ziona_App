// components/post/TextPost.tsx
import { YStack, Text } from 'tamagui'
import { Post } from '@/types/post'

export function TextPost({ post }: { post: Post }) {
  return (
    <YStack
      flex={1}
      backgroundColor="#6B21A8" // purple variant
      justifyContent="center"
      alignItems="center"
      padding="$6"
    >
      <YStack
        backgroundColor="rgba(255,255,255,0.15)"
        padding="$4"
        borderRadius="$4"
      >
        <Text
          color="white"
          fontSize="$6"
          textAlign="center"
          fontWeight="600"
        >
          {post.content.text}
        </Text>
      </YStack>
    </YStack>
  )
}
