import Header from "@/components/layout/header";
import colors from "@/constants/colors";
import { useUpdateAvatar } from "@/hooks/useProfileMutations";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { ChevronRight } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Text, XStack, YStack } from "tamagui";

export default function EditProfileScreen() {
  const avatarMutation = useUpdateAvatar();
  const authUser = useAuthStore((s) => s.user as any)?.data;
  const { data: user, isLoading } = useUserProfile(authUser?.id, {
    enabled: !!authUser?.id,
  });
  console.log("User ID", authUser?.id)

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    const file = {
      uri: asset.uri,
      type: "image/jpeg",
      name: "avatar.jpg",
    };

    avatarMutation.mutate(file);
  };

  console.log("AUTH USER:", authUser);
  console.log("PROFILE USER:", user);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.white, paddingTop: 20 }}
    >
      <XStack paddingLeft={15}>
        <Header
          heading="Edit profile"
          headerFontFamily={"$body"}
          headingSize={16}
          headingWeight={"500"}
        />
      </XStack>

      {/* Avatar */}
      <YStack alignItems="center" gap="$3" paddingVertical={19}>
        <Pressable onPress={handlePickImage}>
          <Avatar circular size="$8">
            <Avatar.Image
              src={user?.avatarUrl || require("@/assets/images/emptyDP.png")}
            />
            <Avatar.Fallback backgroundClip={colors.black} />
          </Avatar>

          <Text fontFamily={"$body"} fontWeight={"400"} color={colors.primary}>
            Change photo
          </Text>
        </Pressable>
      </YStack>

      {/* Info Section */}
      <YStack flex={1} gap={"$4"} padding={10}>
        <Pressable onPress={() => router.push("/profile/edit/name")}>
          <XStack justifyContent="space-around" gap={20}>
            <Text
              color={colors.text}
              fontFamily={"$body"}
              fontWeight={"400"}
              fontSize={16}
            >
              Name
            </Text>
            <Text
              color={colors.text}
              fontFamily={"$body"}
              fontWeight={"500"}
              fontSize={16}
            >
              {isLoading
                ? "loading.."
                : user?.fullName
                  ? user?.fullName
                  : authUser?.email || ""}
            </Text>

            <ChevronRight size={22} color={"#444444"} />
          </XStack>
        </Pressable>

        <Pressable onPress={() => router.push("/profile/edit/username")}>
          <XStack justifyContent="space-around">
            <Text
              color={colors.text}
              fontFamily={"$body"}
              fontWeight={"400"}
              fontSize={16}
            >
              UserName
            </Text>
            <Text fontFamily={"$body"} fontWeight={"500"} fontSize={16}>
              {isLoading
                ? "loading.."
                : user?.username || authUser?.username || ""}
            </Text>

            <ChevronRight size={22} color={"#444444"} />
          </XStack>
        </Pressable>

        <Text
          fontFamily={"$body"}
          fontWeight={"500"}
          fontSize="$3"
          color="$gray10"
          marginBottom="$2"
          marginLeft={10}
        >
          More info
        </Text>

        <YStack paddingHorizontal={20}>
          <Text
            color={colors.text}
            fontFamily={"$body"}
            fontWeight={"400"}
            fontSize={16}
          >
            Bio
          </Text>

          <Pressable onPress={() => router.push("/profile/edit/bio")}>
            <XStack justifyContent="space-around">
              <Text fontFamily={"$body"} fontWeight={"400"} fontSize={16}>
                {isLoading
                  ? "loading.."
                  : user?.bio || "Add a short description about you"}
              </Text>
              <ChevronRight size={22} color={"#444444"} />
            </XStack>
          </Pressable>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
