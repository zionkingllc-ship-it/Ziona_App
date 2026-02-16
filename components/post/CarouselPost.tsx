import { FlatList, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { YStack, Text, XStack } from "tamagui";
import { CarouselPost as CarouselPostType } from "@/types/post";

const { width, height } = Dimensions.get("window");

type Props = {
  post: CarouselPostType;
};

export function CarouselPost({ post }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = post.media.items;

  return (
    <YStack flex={1}>
      <FlatList
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setActiveIndex(index);
        }}
        renderItem={({ item }) => {
          const source =
            typeof item.url === "string"
              ? { uri: item.url }
              : item.url;

          return (
            <Image
              source={source}
              style={{ width, height }}
              contentFit="cover"
            />
          );
        }}
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
      {items.length > 1 && (
        <XStack
          position="absolute"
          bottom={32}
          alignSelf="center"
          gap="$2"
        >
          {items.map((_, i) => (
            <YStack
              key={i}
              width={8}
              height={8}
              borderRadius={4}
              backgroundColor={
                i === activeIndex
                  ? "white"
                  : "rgba(255,255,255,0.4)"
              }
            />
          ))}
        </XStack>
      )}
    </YStack>
  );
}