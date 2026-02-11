import Header from "@/components/layout/header";
import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import colors from "@/constants/colors";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Spinner, Text, XStack, YStack } from "tamagui";

const SUGGESTIONS = ["Zionskin", "Zionskin234", "Zionsliy", "Zio998"];

export default function CreateUsername() {
  const [username, setUsername] = useState("");
  const [available, setAvailable] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null,
  );

  const checkAvailability = (value: string) => {
    setAvailable(value !== "Zioyu00");
  };

  const showInvalid = isFocus && username.length > 0 && !available;

  const visualValidity: boolean | undefined = !isFocus
    ? undefined
    : showInvalid
      ? false
      : true;
  const handleSubmit = () => {
    //setLoading(true);
    setTimeout(() => {
      router.replace("/(tabs)/feed");
    }, 120);
  };
  return (
    <KeyboardAvoidingWrapper>
      <Header />

      <YStack flex={1} padding="$4" gap="$4" marginTop="$10" width="100%">
        <Image
          source={require("@/assets/images/userIcon.png")}
          width="$7"
          height="$7"
          borderRadius="$6"
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
          headingText="Username"
          onfocus={isFocus}
          value={username}
          isValid={visualValidity}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChangeText={(value) => {
            setUsername(value);
            checkAvailability(value);
            setSelectedSuggestion(null);
          }}
        />

        {showInvalid && (
          <Text
            color={colors.errorText}
            fontSize="$3"
            alignSelf="flex-start"
            marginLeft={2}
          >
            {username} already exists, please choose another
          </Text>
        )}

        <YStack gap="$2">
          <Text fontSize="$3" color={colors.headerText}>
            Suggestions:
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {SUGGESTIONS.map((name) => {
              const isSelected = selectedSuggestion === name;

              return (
                <Text
                  key={name}
                  padding="$2"
                  backgroundColor={colors.suggestionBackground}
                  borderRadius="$2"
                  borderWidth={isSelected ? 1 : 0}
                  borderColor={!isSelected ? colors.suggestionBackground : colors.borderColor}
                  onPress={() => {
                    setUsername(name);
                    setAvailable(true);
                    setSelectedSuggestion(name); 
                  }}
                >
                  {name}
                </Text>
              );
            })}
          </XStack>
        </YStack>

        <PrimaryButton
          text="Sign up"
          endIcon={loading && <Spinner color={colors.spinner} />}
          textColor={colors.white}
          color={colors.primary}
          disabled={!username || !available}
          onPress={handleSubmit}
        />
      </YStack>
    </KeyboardAvoidingWrapper>
  );
}
