import { MarqueeCarousel } from "@/components/ui/marquee";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import colors from "@/constants/colors";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, useWindowDimensions } from "react-native";
import { Image, Text, YStack, View } from "tamagui";

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

export default function LoginIndex() {
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
        <MarqueeCarousel cards={cards} />
      </YStack>
      {/* ================= CONTENT ================= */}
      <YStack padding="$5" gap="$4" justifyContent="space-between">
        {/* Title */}
        <YStack marginTop={12}>
          <Text
            fontSize="$4"
            fontWeight="600"
            textAlign="center"
            color={colors.text}
          >
            Login to Ziona
          </Text>
  
        </YStack>

        {/* Buttons */}
        <YStack gap={"$3"}>
          <PrimaryButton
            text="Continue with Username/Email"
            color={colors.white}
            textSize={13}
            textWeight="400"
            onPress={() => router.push("/(auth)/login/signin")}
            startIcon={<Image source={mail} width={24} height={24} />}
          />

          <PrimaryButton
            text="Continue with Google"
            textSize={13}
            textWeight="400"
            color={colors.white}
            onPress={() =>{}}
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
        <YStack gap="$15" alignItems="center">
          <Text fontSize="$3" color={colors.termsText} textAlign="center">
            By continuing, you agree to Ziona’s{" "}
            <Text
              color={colors.termsButton}
              fontWeight="500"
              textDecorationLine="underline"
            >
              Terms of use
            </Text>{" "}
            and confirm that you have read Ziona’s{" "}
            <Text
              color={colors.termsButton}
              fontWeight="500"
              textDecorationLine="underline"
            >
              Privacy Policy
            </Text>
          </Text>
          <YStack justifyContent="center" alignItems="center" marginTop={"$5"}>
  
            <Pressable onPress={() => router.back()} >
              <Text fontSize="$3" >
                Don't have an account?{" "}
                <Text color={colors.primary} fontWeight="900">
                  Signup
                </Text>
              </Text>
            </Pressable>
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
