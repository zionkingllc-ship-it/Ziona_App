import {
  buildPostUrl,
  copyLink,
  openNativeShare,
  shareToMail,
  shareToMessages,
  shareToWhatsApp,
  withHaptic,
} from "@/services/share/services";
import { Post } from "@/types/post";
import React, { useMemo } from "react";
import { FlatList, Modal, Pressable } from "react-native";
import { Image, Text, YStack } from "tamagui";

type Props = {
  visible: boolean;
  onClose: () => void;
  post: Post;
};

export default function ShareModal({ visible, onClose, post }: Props) {
  const url = buildPostUrl(post.id);

  const friends = useMemo(
    () => [
      {
        id: "1",
        name: "Daniel",
        avatar: require("@/assets/images/profile.png"),
      },
      {
        id: "2",
        name: "Miriam",
        avatar: require("@/assets/images/profile.png"),
      },
      {
        id: "3",
        name: "Elijah",
        avatar: require("@/assets/images/profile.png"),
      },
    ],
    [],
  );

  const shareTargets = useMemo(
    () => [
      {
        id: "whatsapp",
        label: "WhatsApp",
        icon: require("@/assets/images/whatsappIcon.png"),
        action: () => shareToWhatsApp(url),
      },
      {
        id: "copy",
        label: "Copy",
        icon: require("@/assets/images/copyIcon.png"),
        action: () => copyLink(url),
      },
      {
        id: "messages",
        label: "Messages",
        icon: require("@/assets/images/messagesIcon.png"),
        action: () => shareToMessages(url),
      },
      {
        id: "mail",
        label: "Mail",
        icon: require("@/assets/images/gmailIcon.png"),
        action: () => shareToMail(url),
      },

      {
        id: "more",
        label: "More",
        icon: require("@/assets/images/moreIcon.png"),
        action: () => openNativeShare(post),
      },
    ],
    [url],
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <YStack
          backgroundColor="white"
          borderTopLeftRadius={24}
          borderTopRightRadius={24}
          padding="$4"
          position="absolute"
          bottom={0}
          width="100%"
        >
          <Text fontSize={18} fontWeight="600" marginBottom="$3" alignSelf="center">
            Share
          </Text>

          {/* FRIENDS LIST */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={friends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <YStack alignItems="center" marginRight={16}>
                <Image
                  source={item.avatar}
                  width={56}
                  height={56}
                  borderRadius={28}
                />
                <Text fontSize={12} marginTop={4} color={"#4E4252"}>
                  {item.name}
                </Text>
              </YStack>
            )}
          />

          {/* SHARE TARGETS GRID */}
          <FlatList
            data={shareTargets}
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 20}}
            renderItem={({ item }) => (
              <Pressable
                style={{ flex: 1, alignItems: "center", marginBottom: 20, marginRight:20 }}
                onPress={() =>
                  withHaptic(async () => {
                    await item.action();
                    onClose();
                  })
                }
              >
                <Image source={item.icon} width={48} height={48} />
                <Text fontSize={12} marginTop={6} color={"#4E4252"}>
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </YStack>
      </Pressable>
    </Modal>
  );
}
