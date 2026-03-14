import Header from "@/components/layout/header";
import TagSelectorCard from "@/components/post/TagSelectorCard";
import { SimpleButton } from "@/components/ui/centerTextButton";
import CategoryModal from "@/components/ui/modals/CategoryModal";

import colors from "@/constants/colors";

import { useResponsive } from "@/hooks/useResponsive";
import { useCreatePostStore } from "@/store/createPostStore";

import { useState } from "react";

import { Image, TextInput, TouchableOpacity } from "react-native";

import { Text, XStack, YStack } from "tamagui";

import { Video } from "expo-av";
// import * as ImagePicker from "expo-image-picker";

export default function CreateMediaScreen() {
  const { wp, hp, fs } = useResponsive();

  const { draft, updateDraft } = useCreatePostStore();

  const [categoryVisible, setCategoryVisible] = useState(false);

  const caption = draft?.text ?? "";

  /* PICK MEDIA */

  async function pickMedia() {
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   quality: 1,
    //   videoMaxDuration: 60,
    // });

    // if (result.canceled) return;

    // const asset = result.assets[0];

    // updateDraft({
    //   media: {
    //     uri: asset.uri,
    //     type: asset.type === "video" ? "video" : "image",
    //   },
    // });
  }

  const media = draft?.media;

  return (
    <YStack
      flex={1}
      backgroundColor={colors.white}
      paddingTop={hp(5)}
      paddingHorizontal={wp(6)}
    >
      {/* HEADER */}

      <Header heading="Add details" />

      {/* MEDIA PREVIEW */}

      <YStack marginTop={hp(2)} gap={hp(1)}>
        {media?.uri && media.type === "image" && (
          <Image
            source={{ uri: media.uri }}
            style={{
              width: wp(32),
              height: wp(24),
              borderRadius: 6,
            }}
          />
        )}

        {media?.uri && media.type === "video" && (
          <Video
            source={{ uri: media.uri }}
            style={{
              width: wp(32),
              height: wp(24),
              borderRadius: 6,
            }}
            useNativeControls
            resizeMode="cover"
          />
        )}

        <TouchableOpacity
          onPress={pickMedia}
          style={{
            backgroundColor: "#F1EFF2",
            paddingVertical: hp(0.7),
            borderRadius: 6,
            alignItems: "center",
            width: wp(32),
          }}
        >
          <Text fontFamily={"$body"} fontSize={fs(12)}>
            Change media
          </Text>
        </TouchableOpacity>
      </YStack>

      {/* CAPTION */}

      <YStack marginTop={hp(3)}>
        <Text fontFamily={"$body"} fontSize={fs(14)} marginBottom={hp(1)}>
          Write a caption
        </Text>

        <TextInput
          multiline
          value={caption}
          onChangeText={(text) =>
            updateDraft({
              text,
            })
          }
          maxLength={300}
          style={{
            minHeight: hp(8),
            borderBottomWidth: 1,
            borderColor: "#E5E5E5",
            fontSize: fs(14),
            fontFamily: "MonaSans_400",
          }}
        />

        <Text
          fontFamily={"$body"}
          fontSize={fs(11)}
          alignSelf="flex-end"
          color="#8A7F87"
          marginTop={hp(0.5)}
        >
          {caption.length}/300
        </Text>
      </YStack>

      {/* TAG */}

      <XStack marginTop={hp(3)}>
        <TagSelectorCard
          category={draft?.category}
          onPress={() => setCategoryVisible(true)}
        />
      </XStack>

      {/* PREVIEW BUTTON */}

      <YStack marginTop="auto" marginBottom={hp(4)}>
        <SimpleButton
          text="Preview"
          textColor={colors.white}
          color={colors.primary}
          onPress={() => {}}
        />
      </YStack>

      {/* CATEGORY MODAL */}

      <CategoryModal
        visible={categoryVisible}
        onClose={() => setCategoryVisible(false)}
        onSelect={(category) => {
          updateDraft({
            category,
          });

          setCategoryVisible(false);
        }}
      />
    </YStack>
  );
}
