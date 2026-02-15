// components/modals/BookmarkFoldersModal.tsx

import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { View, Text, XStack } from "tamagui";
import KeyboardBottomSheetModal from "./KeyboardBottomSheetModal";

interface Folder {
  id: string;
  name: string;
  cover: string;
  selected?: boolean;
}

interface Props {
  visible: boolean;
  folders: Folder[];
  onClose: () => void;
  onSelectFolder: (folder: Folder) => void;
  onCreateNew: () => void;
}

export default function BookmarkFoldersModal({
  visible,
  folders,
  onClose,
  onSelectFolder,
  onCreateNew,
}: Props) {
  return (
    <KeyboardBottomSheetModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontWeight="600">Folders</Text>
          <TouchableOpacity onPress={onCreateNew}>
            <Text color="#7A2E8A">+ Create new folder</Text>
          </TouchableOpacity>
        </XStack>

        <FlatList
          data={folders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => onSelectFolder(item)}
            >
              <Image source={{ uri: item.cover }} style={styles.image} />

              <Text flex={1}>{item.name}</Text>

              <Text color={item.selected ? "#7A2E8A" : "#ccc"}>
                {item.selected ? "🔖" : "📑"}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </KeyboardBottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
});