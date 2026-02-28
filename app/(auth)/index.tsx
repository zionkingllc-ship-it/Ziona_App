import { InlineUnderlineText } from "@/components/ui/InlineUnderlineText";
import { MarqueeCarousel } from "@/components/ui/marquee";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import colors from "@/constants/colors";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, useWindowDimensions } from "react-native";
import { Image, Text, YStack } from "tamagui";

const cards = [
  {
    id: "1",
    image: require("@/assets/images/index1.png"),
    text: "Enjoy ads-free faith based content",
  },
  {
    id: "2",
    image: require("@/assets/images/index2.png"),
    text: "Create and share content to Christian friends around the world",
  },
  {
    id: "3",
    image: require("@/assets/images/index3.png"),
    text: "Connect with God from wherever you are, with prayer circles",
  },
];

export default function AuthIndex() {
  const { width, height } = useWindowDimensions();

  const CARD_WIDTH = Math.min(width * 0.7, 350);
  const CARD_HEIGHT = height * 0.28;
  const GAP = 16;

  const TOTAL_WIDTH = (CARD_WIDTH + GAP) * cards.length;

  const translateX = useRef(new Animated.Value(0)).current;

  const facebook = require("@/assets/images/facebook.png");
  const google = require("@/assets/images/google.png");
  const mail = require("@/assets/images/maiIcon.png");

  /* --------------------------------------------------
     Continuous marquee animation
  --------------------------------------------------- */
  useEffect(() => {
    const start = () => {
      translateX.setValue(0);

      Animated.timing(translateX, {
        toValue: -TOTAL_WIDTH,
        duration: 26000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => start());
    };

    start();
  }, [TOTAL_WIDTH]);

  return (
    <YStack flex={1}>
      <YStack>
        <MarqueeCarousel animationType="loop" cards={cards} />
      </YStack>
      {/* ================= CONTENT ================= */}
      <YStack flex={1} top={16} gap={"$4"} paddingHorizontal={16} justifyContent="space-between">
        {/* Title */}
        <YStack gap="$2">
          <Text
            fontSize="$4"
            fontWeight="600"
            fontFamily={"$body"}
            textAlign="center"
            color={colors.text}
          >
            Sign up for Ziona
          </Text>
          <Text
            fontSize="$3"
            fontWeight="400"
            fontFamily={"$body"}
            textAlign="center"
            color={colors.subHeader}
          >
            Create a profile, follow worshippers, share worship moments, and
            join a global community of faith.
          </Text>
        </YStack>

        {/* Buttons */}
        <YStack gap="$3">
          <PrimaryButton
            text="Continue with Email"
            color={colors.white}
            textSize={13}
            textWeight="400"
            onPress={() => router.push("/(auth)/email")}
            startIcon={<Image source={mail} width={24} height={24} />}
          />

          <PrimaryButton
            text="Continue with Google"
            textSize={13}
            textWeight="400"
            color={colors.white}
            onPress={() => {}}
            startIcon={<Image source={google} width={23} height={23} />}
          />

          <PrimaryButton
            text="Continue with Facebook"
            textSize={13}
            textWeight="400"
            color={colors.white}
            onPress={() => {}}
            startIcon={<Image source={facebook} width={23} height={23} />}
          />
        </YStack>

        {/* Footer */}
        <YStack>
          <Text
            fontSize="$3"
            fontWeight="400"
            fontFamily={"$body"}
            color={colors.termsText}
            textAlign="center"
          >
            By continuing, you agree to Ziona’s{" "}
            <InlineUnderlineText
              color={colors.termsButton}
              weight="500"
              fontFamily="$heading"
              thickness={2}
              offset={-2}
            >
              Terms of use
            </InlineUnderlineText>
            {"   "}
            and confirm that you have read Ziona’s{" "}
            <Pressable
              onPress={() =>
                router.push(
                  "https://www.privacypolicies.com/live/db459a7c-78ec-4d12-8d82-cf20f7e716a6",
                )
              }
            >
              <InlineUnderlineText
                color={colors.termsButton}
                weight="500"
                fontFamily="$heading"
                thickness={2}
                offset={-2}
              >
                Privacy Policy
              </InlineUnderlineText>
            </Pressable>
          </Text>
        </YStack>
        <YStack
          justifyContent="flex-end"
          alignItems="center" 
          height={"20%"}
          paddingBottom={20}
        >
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderRadius: 8,
            }}
            onPress={() => router.push("/(tabs)/feed")}
          >
            <InlineUnderlineText
              color={colors.text}
              thickness={1.5}
              offset={-1}
              weight="400"
            >
              Skip for now
            </InlineUnderlineText>
          </Pressable>

          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text fontSize="$3" fontFamily={"$body"}>
              Already have an account?{" "}
              <Text
                color={colors.primary}
                fontWeight="700"
                fontFamily={"$body"}
              >
                Login
              </Text>
            </Text>
          </Pressable>
        </YStack>
      </YStack>
    </YStack>
  );
}
