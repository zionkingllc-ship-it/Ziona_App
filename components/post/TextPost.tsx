import { YStack, Text, Image } from "tamagui";
import { TextPost as TextPostType } from "@/types/post";
import colors from "@/constants/colors";

type Props = {
  post: TextPostType;
};

export function TextPost({ post }: Props) {
  const backgroundSource =
    typeof post.media.backgroundImage === "string"
      ? { uri: post.media.backgroundImage }
      : post.media.backgroundImage;

  return (
    <YStack flex={1}>
      <Image
        source={backgroundSource}
        position="absolute"
        width="90%"
        height="200%"
      />

      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="$6"
        backgroundColor="rgba(0,0,0,0.3)"
      >
        <YStack
          backgroundColor="rgba(255,255,255,0.15)"
          padding="$4"
          borderRadius="$4"
        >
          <Text
            color={colors.black}
            fontSize="$6"
            textAlign="center"
            fontWeight="600"
          >
            {post.text}
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}