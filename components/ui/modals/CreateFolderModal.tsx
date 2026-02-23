import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View, XStack } from "tamagui";
import KeyboardBottomSheetModal from "./KeyboardBottomSheetModal";
import { Post } from "@/types/post";
import { generateVideoThumbnail } from "@/helpers/thumbnailGenerator";

interface Props {
  visible: boolean;
  post: Post;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function CreateFolderModal({
  visible,
  post,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  useEffect(() => {
  if (!visible || !post) {
    setName("");
    return;
  }

  async function resolveCover() {
    if (post.type === "image") {
      setThumbnailUri(post.media.url);
      return;
    }

    if (post.type === "video") {
      if (post.media.thumbnailUrl) {
        setThumbnailUri(post.media.thumbnailUrl);
        return;
      }

      const generated = await generateVideoThumbnail(
        typeof post.media.videoUrl === "string"
          ? post.media.videoUrl
          : ""
      );

      if (generated) {
        setThumbnailUri(generated);
      }
      return;
    }

    if (post.type === "carousel") {
      const firstItem = post.media.items?.[0];
      if (firstItem) {
        setThumbnailUri(firstItem.thumbnailUrl ?? firstItem.url);
      }
      return;
    }

    if (post.type === "text") {
      setThumbnailUri(null);
    }
  }

  resolveCover();
}, [visible, post]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
  };

  return (
    <KeyboardBottomSheetModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <XStack justifyContent="space-between" alignItems="center">
          <TouchableOpacity onPress={handleSave}>
            <Text fontFamily="$body" color="#7A2E8A" fontWeight="600">
              Save
            </Text>
          </TouchableOpacity>

          <Text fontFamily="$body" fontWeight="600">
            New Folder
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Text>✕</Text>
          </TouchableOpacity>
        </XStack>

        {/* COVER PREVIEW */}
        {post.type === "text" ? (
          <Image
            source={post.media.backgroundImage}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : thumbnailUri ? (
          <Image
            source={{ uri: thumbnailUri }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}

        <TextInput
          placeholder="Create Folder Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      </View>
    </KeyboardBottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  cover: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignSelf: "center",
  },
  coverPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignSelf: "center",
    backgroundColor: "#e5e5e5",
  },
  input: {
    borderRadius: 12,
    backgroundColor: "#F3F3F3",
    padding: 14,
  },
});