// components/modals/CreateFolderModal.tsx

import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { View, Text, XStack } from "tamagui";
import KeyboardBottomSheetModal from "./KeyboardBottomSheetModal";

interface Props {
  visible: boolean;
  coverImage: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function CreateFolderModal({
  visible,
  coverImage,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");

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
            <Text color="#7A2E8A" fontWeight="600">
              Save
            </Text>
          </TouchableOpacity>

          <Text fontWeight="600">New Folder</Text>

          <TouchableOpacity onPress={onClose}>
            <Text>✕</Text>
          </TouchableOpacity>
        </XStack>

        <Image source={{ uri: coverImage }} style={styles.cover} />

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
  input: {
    borderRadius: 12,
    backgroundColor: "#F3F3F3",
    padding: 14,
  },
});