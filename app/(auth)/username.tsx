import { YStack, Text, XStack, Image } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import colors from "@/constants/colors";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import { GradientBackground } from "@/components/layout/GradientBackground";

const SUGGESTIONS = ["Zionskin", "Zionskin234", "Zionsliy", "Zio998"];

export default function CreateUsername() {
  const [username, setUsername] = useState("");
  const [available, setAvailable] = useState(true);
  const [isFocus, setIsFocus] = useState(false);

  const checkAvailability = (value: string) => {
    setAvailable(value !== "Zioyu00");
  };

  const showInvalid =
    isFocus && username.length > 0 && !available;

  const visualValidity: boolean | undefined = !isFocus
    ? undefined
    : showInvalid
    ? false
    : true;

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingWrapper>
          <ChevronLeft
            size={24}
            marginLeft={10}
            marginTop={5}
            color={colors.primary}
            onPress={() => router.back()}
          />

          <YStack
            flex={1}
            padding="$4"
            gap="$4"
            justifyContent="center"
            width="100%"
          >
            <Image
              source={require("@/assets/images/userIcon.png")}
              width="30%"
              height={80}
              alignSelf="center"
            />

            <YStack alignItems="center" marginTop="$6" gap="$2">
              <Text fontSize="$5" fontWeight="600">
                Create username
              </Text>

              <Text fontSize="$3" color={colors.gray}>
                You can always change this later
              </Text>
            </YStack>

            <TextInputWithIcon
              placeholder="Username"
              value={username}
              isValid={visualValidity}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChangeText={(value) => {
                setUsername(value);
                checkAvailability(value);
              }}
            />

            {showInvalid && (
              <Text color={colors.danger} fontSize="$2">
                Username already exists, please choose another
              </Text>
            )}

            <YStack gap="$2">
              <Text fontSize="$3">Suggestions:</Text>
              <XStack gap="$2" flexWrap="wrap">
                {SUGGESTIONS.map((name) => (
                  <Text
                    key={name}
                    padding="$2"
                    borderRadius="$2"
                    onPress={() => {
                      setUsername(name);
                      setAvailable(true);
                    }}
                  >
                    {name}
                  </Text>
                ))}
              </XStack>
            </YStack>

            <PrimaryButton
              text="Sign up"
              textColor={colors.white}
              color={colors.primary}
              disabled={!username || !available}
              onPress={() => router.replace("/(tabs)/feed")}
            />
          </YStack>
        </KeyboardAvoidingWrapper>
      </SafeAreaView>
    </GradientBackground>
  );
}