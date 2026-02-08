import { ScrollView } from 'react-native'
import { YStack, Text } from 'tamagui'
import { useRef, useEffect } from 'react'
import * as Haptics from 'expo-haptics'

const ITEM_HEIGHT = 44
const VISIBLE_ITEMS = 5
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2)

export function DateWheel({ data, value, onChange }) {
  const scrollRef = useRef<ScrollView>(null)
  const selectedIndex = Math.max(0, data.findIndex((v) => v === value))

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: selectedIndex * ITEM_HEIGHT,
      animated: false,
    })
  }, [selectedIndex])

  return (
    <YStack
      height={ITEM_HEIGHT * VISIBLE_ITEMS}
      overflow="hidden"
      position="relative"
    >
      {/* Fixed selection background */}
      <YStack
        position="absolute"
        top={ITEM_HEIGHT * CENTER_INDEX}
        height={ITEM_HEIGHT}
        width="100%"
        backgroundColor="#fbeffc"
        borderRadius={8}
        pointerEvents="none"
      />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * CENTER_INDEX,
        }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.y / ITEM_HEIGHT
          )

          if (index !== selectedIndex) {
            onChange(data[index])
            Haptics.selectionAsync()
          }
        }}
      >
        {data.map((item, index) => {
          const isSelected = index === selectedIndex

          return (
            <YStack
              key={index}
              height={ITEM_HEIGHT}
              justifyContent="center"
              alignItems="center"
              paddingHorizontal={10}
            >
              <Text
                fontSize={isSelected ? '$5' : '$4'}
                fontWeight={isSelected ? '500' : '400'}
                opacity={isSelected ? 1 : 0.35}
                
              >
                {item}
              </Text>
            </YStack>
          )
        })}
      </ScrollView>
    </YStack>
  )
}