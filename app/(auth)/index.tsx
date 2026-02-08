import { ScrollView, XStack, YStack, Text, Button, Image } from "tamagui";
import { router } from "expo-router";
import { Mail } from "@tamagui/lucide-icons";
import { Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GradientBackground } from "@/components/layout/GradientBackground";

const cards = [
  {
    id: "1",
    image: require("@/assets/images/index1.png"),
    text: "Connect with believers wherever you are",
  },
  {
    id: "2",
    image: require("@/assets/images/index2.png"),
    text: "Create and share content to Christian friends around the world",
  },
  {
    id: "3",
    image: require("@/assets/images/index3.png"),
    text: "Grow spiritually with a global faith community",
  },
];

export default function AuthIndex() {
  const { width, height } = useWindowDimensions();
  const CARD_WIDTH = Math.min(width * 0.7, 280);
  const CARD_HEIGHT = height * 0.28;
  const facebook = require("@/assets/images/facebook.png");
  const google = require("@/assets/images/google.png");
  const mail = require("@/assets/images/maiIcon.png");

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1}}>
        <YStack flex={1}>
          {/* Carousel */}

          <YStack
            height={CARD_HEIGHT + 40}
            position="relative"
            overflow="hidden"
          >
            {/* Background image */}
            <Image
              source={require("@/assets/images/index2.png")}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              opacity={0.3}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 16}
              decelerationRate="fast"
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 24,
              }}
            >
              <XStack gap="$4">
                {cards.map((card) => (
                  <YStack
                    key={card.id}
                    width={CARD_WIDTH}
                    height={CARD_HEIGHT}
                    borderRadius={20}
                    overflow="hidden"
                    backgroundColor="#000"
                  >
                    <Image source={card.image} width="100%" height="100%" />

                    <YStack
                      position="absolute"
                      bottom={16}
                      left={16}
                      right={16}
                    >
                      <Text color="white" fontSize="$3" fontWeight="400">
                        {card.text}
                      </Text>
                    </YStack>
                  </YStack>
                ))}
              </XStack>
            </ScrollView>
          </YStack>

          {/* Content */}
          <YStack padding="$5" gap="$4" justifyContent="space-between">
            {/* Title */}
            <YStack gap="$2">
              <Text
                fontSize="$4"
                fontWeight="600"
                textAlign="center"
                color={colors.text}
              >
                Sign up for Ziona
              </Text>
              <Text fontSize={"$3"} fontWeight={"400"} textAlign="center">
                Create a profile, follow worshippers, share worship moments, and
                join a global community of faith.
              </Text>
            </YStack>

            {/* Buttons */}
            <YStack gap="$3">
              <PrimaryButton
                text=" Username/Email Signin"
                color={colors.white}
                textSize={13}
                textWeight={"400"}
                onPress={() => router.push("/(auth)/email")}
                startIcon={<Image source={mail} width={24} height={24} />}
              />

              <PrimaryButton
                text="Continue with Google"
                textSize={13}
                textWeight={"400"}
                onPress={() => router.push("/(auth)/email")}
                startIcon={<Image source={google} width={23} height={23} />}
              />
              <PrimaryButton
                text="Continue with Facebook"
                textSize={13}
                textWeight={"400"}
                onPress={() => router.push("/(auth)/email")}
                startIcon={<Image source={facebook} width={23} height={23} />}
              />
            </YStack>

            {/* Footer */}
            <YStack gap={"$7"} alignItems="center">
              <Text fontSize="$3" color={colors.balanceText}>
                By continuing, you agree to Ziona’s{" "}
                <Text
                  color={colors.secondary}
                  fontWeight={"900"}
                  textDecorationLine="underline"
                >
                  Terms of use
                </Text>{" "}
                and confirm that you have read Ziona’s{" "}
                <Pressable>
                  <Text
                    color={colors.secondary}
                    fontWeight={"900"}
                    textDecorationLine="underline"
                  >
                    Privacy Policy
                  </Text>
                </Pressable>
              </Text>

              <Pressable
                style={{
                  width: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.white,
                  padding: 10,
                  borderRadius: 8,
                }}
                onPress={() => router.push("/(tabs)/feed")}
              >
                <Text fontSize={"$3"} fontWeight="600">
                  Skip for now
                </Text>
              </Pressable>

              <Pressable onPress={() => router.push("/(auth)/signin")}>
                <Text fontSize="$3">
                  Already have an account?{" "}
                  <Text color="$purple10" fontWeight="900">
                    Login
                  </Text>
                </Text>
              </Pressable>
            </YStack>
          </YStack>
        </YStack>
      </SafeAreaView>
    </GradientBackground>
  );
}
