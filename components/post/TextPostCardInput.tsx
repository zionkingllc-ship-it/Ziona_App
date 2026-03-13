import colors from "@/constants/colors";
import { useResponsive } from "@/hooks/useResponsive";
import { TextInput } from "react-native";
import { Image, Text, View, XStack, YStack } from "tamagui";

interface Props {
  category?: string;
  backgroundColor?: string;

  scripture?: string;
  translation?: string;
  verseText?: string;

  value: string;
  onChangeText: (text: string) => void;

  maxLength?: number;
}

export default function TextPostCardInput({
  category,
  backgroundColor = "#E6E2C5",

  scripture,
  translation,
  verseText,

  value,
  onChangeText,
  maxLength = 500,
}: Props) {
  const { wp, hp, fs } = useResponsive();

  const flapImage = require("@/assets/images/jounalFlap2.png");

  /* Correct length calculation */

  const verseLength = verseText ? verseText.length : 0;
  const used = value.length + verseLength;
  const remaining = Math.max(maxLength - used, 0);

  return (
    <View flex={1}>
      {/* Decorative Strip */}

      <View
        position="absolute"
        left={-wp(3)}
        bottom={-hp(5)}
        pointerEvents="none"
      >
        <Image
          source={flapImage}
          width={wp(14)}
          height={hp(12)}
          resizeMode="contain"
        />
      </View>

      <XStack
        flex={1}
        backgroundColor={backgroundColor}
        padding={hp(1)}
        minHeight={hp(52)}
        borderRadius={wp(4)}
      >
        {/* Left strip */}

        <YStack
          width={wp(3)}
          height={"103%"}
          marginTop={-wp(1.5)}
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

          {/* INPUT AREA */}

          <View flex={1} justifyContent="space-between">
            <TextInput
              value={value}
              onChangeText={(text) => {
                if (text.length + verseLength <= maxLength) {
                  onChangeText(text);
                }
              }}
              placeholder="Write your testimony..."
              multiline
              style={{
                flex: 1,
                fontSize: fs(17),
                color: colors.black,
                lineHeight: fs(25),
                textAlignVertical: "top",
              }}
            />

            {/* COUNTER */}

            <Text
              alignSelf="flex-end"
              fontSize={fs(11)}
              color="#836F8B"
              marginTop={hp(1)}
            >
              {used}/{maxLength}
            </Text>
          </View>
        </YStack>
      </XStack>
    </View>
  );
}
