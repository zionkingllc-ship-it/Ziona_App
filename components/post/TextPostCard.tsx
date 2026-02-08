import { YStack, Text } from 'tamagui'
// import { LinearGradient } from 'expo-linear-gradient'
import { TextPost } from '@/types'
import { postBackgroundMap } from '@/utils/postBackground'

type Props = {
  post: TextPost
}

export function TextPostCard({ post }: Props) {
   const bg = postBackgroundMap[post.backgorund]

  const isGradient = typeof bg === 'object' && bg.type === 'gradient'

  //const Wrapper = isGradient ? LinearGradient : YStack
  const Wrapper =  YStack

  return (
    <Wrapper
      {...(isGradient
        ? { colors: bg.colors }
        : { backgroundColor: bg })}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <YStack
        backgroundColor="rgba(255,255,255,0.15)"
        padding="$5"
        borderRadius="$4"
        maxWidth="85%"
      >
        <Text
          color="white"
          fontSize="$6"
          fontWeight="600"
          textAlign="center"
          lineHeight="$6"
        >
          {post.text}
        </Text>
      </YStack>
    </Wrapper>
  )
}
