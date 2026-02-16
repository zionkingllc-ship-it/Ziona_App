import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { View, Text, XStack } from "tamagui";
import KeyboardBottomSheetModal from "./KeyboardBottomSheetModal";
import { Folder } from "@/types/folder";

interface Props {
  visible: boolean;
  folders: Folder[];
  savedFolderIds: string[];
  onClose: () => void;
  onToggleFolder: (folderId: string) => void;
  onCreateNew: () => void;
}

export default function BookmarkFoldersModal({
  visible,
  folders,
  savedFolderIds,
  onClose,
  onToggleFolder,
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
          renderItem={({ item }) => {
            const isSaved = savedFolderIds.includes(item.id);

            return (
              <TouchableOpacity
                style={styles.row}
                onPress={() => onToggleFolder(item.id)}
              >
                <Image source={{ uri: item.cover }} style={styles.image} />

                <Text flex={1}>{item.name}</Text>

                <Text color={isSaved ? "#7A2E8A" : "#ccc"}>
                  {isSaved ? "🔖" : "📑"}
                </Text>
              </TouchableOpacity>
            );
          }}
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