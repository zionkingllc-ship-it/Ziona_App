import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import Header from "@/components/layout/header";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import { SimpleButton } from "@/components/ui/centerTextButton";
import colors from "@/constants/colors";
import { isPasswordValid } from "@/utils/passwordRules";
import { Eye, EyeClosed } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
import { Image, Text, YStack } from "tamagui";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Email() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const isValidEmail = emailRegex.test(email);
  const Xspecial = require("@/assets/images/closeSquare.png");
  const showInvalid = isFocus && email.length > 0 && !isValidEmail;

  const passwordIsValid = isPasswordValid(password);
  const showInvalid1 = isFocus1 && password.length > 0 && !passwordIsValid;

  const visualValidEmail: boolean | undefined = !isFocus
    ? undefined
    : showInvalid
      ? false
      : true;
  const visualValidPassword: boolean | undefined = !isFocus1
    ? undefined
    : showInvalid1
      ? false
      : true;

  const handleNext = () => {
    if (!isValidEmail || loading) return;

    setLoading(true);

    // Allow spinner to render before navigation
    requestAnimationFrame(() => {
      setTimeout(() => {
        router.push("/(tabs)/feed");
      }, 120);
    });
  };

  return (
    <KeyboardAvoidingWrapper>
      <Header />

      <YStack
        flex={1}
        padding="$4"
        gap="$4"
        alignItems="center"
        marginTop="$10"
        width="100%"
      >
        <Image
          source={require("@/assets/images/mailWithBoder.png")}
          width="$7"
          height="$7"
          borderRadius="$6"
        />

        <YStack alignItems="center" marginTop="$6" gap="$3">
          <Text fontSize="$4" fontWeight="600">
            Your email address
          </Text>
        </YStack>
        <YStack width={"100%"}>
          <TextInputWithIcon
            value={email}
            onfocus={isFocus}
            placeholder="Username/Email"
            headingText="Email address"
            onChangeText={setEmail}
            keyboardType="email-address"
            endIconVisible={isFocus}
            isValid={visualValidEmail}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            endIcon={<Image src={Xspecial} width="$1.5" />}
            onEndIconPress={() => setEmail("")}
          />
          {showInvalid && (
            <Text
              fontSize="$3"
              color={colors.errorText}
              alignSelf="flex-start"
              marginTop={"$2"}
            >
              This username/email does not exist
            </Text>
          )}
        </YStack>
        <YStack width={"100%"}>
          <TextInputWithIcon
            value={password}
            placeholder="Enter password"
            endIconVisible={password.length > 0 && isFocus1}
            onChangeText={setPassword}
            onfocus={isFocus1}
            headingText="Password"
            isValid={visualValidPassword}
            onFocus={() => setIsFocus1(true)}
            onBlur={() => setIsFocus1(false)}
            endIcon={
              show ? (
                <Eye size={24} color={colors.inputIconColor} />
              ) : (
                <EyeClosed size={24} color={colors.inputIconColor} />
              )
            }
            secureTextEntry={!show}
            onEndIconPress={() => setShow((prev) => !prev)}
          />
          {showInvalid1 && (
            <Text
              fontSize="$3"
              color={colors.errorText}
              alignSelf="flex-start"
              marginTop={"$2"}
            >
              You have entered an incorrect password
            </Text>
          )}
          <Pressable onPress={() => router.push("/(auth)/forgotPassword")}>
            <Text
              fontSize="$3"
              color={colors.forgotPassword}
              alignSelf="flex-end"
              marginTop={"$2"}
            >
              Forgot password?
            </Text>
          </Pressable>
        </YStack>
        <SimpleButton
          text="Next"
          textColor={colors.buttonText}
          color={colors.primaryButton}
          disabled={!isValidEmail || !passwordIsValid}
          loading={loading}
          onPress={handleNext}
          style={{ width: "100%", marginTop: 20 }}
        />
      </YStack>
    </KeyboardAvoidingWrapper>
  );
}
