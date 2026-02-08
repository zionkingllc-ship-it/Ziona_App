import { FlatList, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { useState } from 'react'
import { YStack, Text, XStack } from 'tamagui'
import { CarouselPost as CarouselPostType } from '@/types'

const { width, height } = Dimensions.get('window')

type Props = {
  post: CarouselPostType
}

export function CarouselPost({ post }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <YStack flex={1}>
      <FlatList
        data={post.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          )
          setActiveIndex(index)
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height }}
            contentFit="cover"
          />
        )}
      />

      {/* Caption */}
      {post.caption && (
        <YStack
          position="absolute"
          bottom={80}
          left={16}
          right={80}
        >
          <Text color="white" fontSize="$5">
            {post.caption}
          </Text>
        </YStack>
      )}

      {/* Pagination dots */}
      {post.images.length > 1 && (
        <XStack
          position="absolute"
          bottom={32}
          alignSelf="center"
          gap="$2"
        >
          {post.images.map((_, i) => (
            <YStack
              key={i}
              width={8}
              height={8}
              borderRadius={4}
              backgroundColor={
                i === activeIndex ? 'white' : 'rgba(255,255,255,0.4)'
              }
            />
          ))}
        </XStack>
      )}
    </YStack>
  )
}
