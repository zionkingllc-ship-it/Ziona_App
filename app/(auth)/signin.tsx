import { YStack, Text, Image } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { X, Eye, EyeOff, ChevronLeft } from "@tamagui/lucide-icons";

import colors from "@/constants/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";

 

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidIdentifier = (value: string) => {
  if (!value) return false;
  if (value.includes("@")) {
    return emailRegex.test(value);
  }
  return value.length >= 3; // username rule
};

 

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  const handleLogin = () => {
    // reset errors
    setIdentifierError(null);
    setPasswordError(null);
    setAuthError(false);

    // validate identifier
    if (!isValidIdentifier(identifier)) {
      setIdentifierError("Enter a valid username or email");
      return;
    }

    // validate password
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    // 🔌 mock auth failure (backend later)
    if (password === "wrong") {
      setAuthError(true);
      return;
    }

    // success
    router.replace("/(tabs)/feed");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingWrapper backgroundColor={colors.background}>
        {/* Back */}
        <ChevronLeft
          size={24}
          marginLeft={12} 
          color={colors.primary}
          onPress={() => router.back()}
        />

        <YStack
          flex={1}
          padding="$4"
          justifyContent="center"
          alignItems="center"
          gap="$4"
        >
          {/* Icon */}
          <Image
            source={require("@/assets/images/userIcon.png")}
            width={64}
            height={64}
          />

          <Text fontSize="$5" fontWeight="600">
            Log in
          </Text>

          {/* Username / Email */}
          <YStack width="100%" gap="$2">
            <Text fontSize="$3" fontWeight="600">
              Username / Email
            </Text>

            <TextInputWithIcon
              value={identifier}
              placeholder="Username or email"
              onChangeText={(t) => {
                setIdentifier(t);
                setIdentifierError(null);
                setAuthError(false);
              }}
              endIcon={identifier ? <X size={16} /> : undefined}
              onEndIconPress={() => setIdentifier("")}
              isValid={!identifierError}
            />

            {identifierError && (
              <Text fontSize="$3" color={colors.danger}>
                {identifierError}
              </Text>
            )}
          </YStack>

          {/* Password */}
          <YStack width="100%" gap="$2">
            <Text fontSize="$3" fontWeight="600">
              Password
            </Text>

            <TextInputWithIcon
              value={password}
              placeholder="Password"
              secureTextEntry={!showPassword}
              onChangeText={(t) => {
                setPassword(t);
                setPasswordError(null);
                setAuthError(false);
              }}
              endIcon={
                showPassword ? <Eye size={16} /> : <EyeOff size={16} />
              }
              onEndIconPress={() => setShowPassword(!showPassword)}
              isValid={!passwordError}
            />

            {passwordError && (
              <Text fontSize="$3" color={colors.danger}>
                {passwordError}
              </Text>
            )}
          </YStack>

          {/* Forgot password */}
          <Pressable
            style={{ alignSelf: "flex-end", marginTop: 4 }}
            onPress={() => router.push("/(auth)/forgotPassword")}
          >
            <Text fontSize="$3" color={colors.primary}>
              Forgot password?
            </Text>
          </Pressable>

          {/* Auth error */}
          {authError && (
            <Text color={colors.danger} fontSize="$3" marginTop="$2">
              Incorrect username/email or password
            </Text>
          )}

          {/* Button */}
          <PrimaryButton
            text="Log in"
            color={colors.primary}
            textColor={colors.white}
            onPress={handleLogin}
            style={{ width: "100%", marginTop: 16 }}
          />
        </YStack>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
}