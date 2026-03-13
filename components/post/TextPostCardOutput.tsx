import { Text, View, XStack, YStack } from "tamagui";
import { useResponsive } from "@/hooks/useResponsive";
import colors from "@/constants/colors";

interface Props {
  category?: string;
  scripture?: string; // e.g. John 3:16
  translation?: string; // e.g. KJV
  verseText?: string;
  testimonyText?: string;
}

export default function TextPostCardOutput({
  category,
  scripture,
  translation,
  verseText,
  testimonyText,
}: Props) {
  const { wp, hp, fs } = useResponsive();

  return (
    <XStack
      flex={1}
      backgroundColor={"#D9C0A0"}
      padding={hp(1.5)}
      borderRadius={wp(1.5)}
    >
      {/* Decorative Strip */}

      <YStack
        width={wp(3)}
        height={"110%"}
        marginTop={-wp(3)}
        backgroundColor={"#573f2114"}
      />

      {/* Content */}

      <YStack flex={1} padding={hp(1)}>

        {/* HEADER */}

        {(category || scripture) && (
          <YStack
            paddingBottom={hp(1.5)}
            borderBottomWidth={1}
            borderColor="#62292E"
            marginBottom={hp(2)}
          >
            {category && (
              <Text
                fontFamily="$script"
                fontWeight="600"
                fontSize={fs(15)}
                color={colors.black}
              >
                {category}
              </Text>
            )}

            <XStack justifyContent="space-between" alignItems="center">
              {scripture && (
                <Text
                  fontFamily="$script"
                  fontWeight="600"
                  fontSize={fs(15)}
                  color={colors.black}
                >
                  {scripture}
                </Text>
              )}

              {translation && (
                <View
                  borderWidth={1}
                  borderColor="#836F8B"
                  borderRadius={wp(2)}
                  paddingHorizontal={wp(3)}
                  paddingVertical={hp(0.6)}
                >
                  <Text
                    fontFamily="$body"
                    fontWeight="600"
                    fontSize={fs(11)}
                    color="#836F8B"
                  >
                    {translation}
                  </Text>
                </View>
              )}
            </XStack>
          </YStack>
        )}

        {/* VERSE */}

        {verseText && (
          <View
            borderLeftWidth={3}
            borderLeftColor="#62292E"
            paddingLeft={wp(4)}
            marginBottom={hp(2)}
          >
            <Text
              fontFamily="$heading"
              fontWeight="400"
              fontSize={fs(17)}
              fontStyle="italic"
              color={colors.black}
              lineHeight={fs(25)}
            >
              {verseText}
            </Text>
          </View>
        )}

        {/* TESTIMONY */}

        {testimonyText && (
          <Text
            fontFamily="$heading"
            fontWeight="400"
            fontSize={fs(17)}
            color={colors.black}
            lineHeight={fs(25)}
          >
            {testimonyText}
          </Text>
        )}
      </YStack>
    </XStack>
  );
}