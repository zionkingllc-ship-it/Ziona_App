import colors from "@/constants/colors";
import BaseModal from "./BaseModal";

import { BibleVerse } from "@/types/bible";

import { X } from "@tamagui/lucide-icons";
import { useEffect, useRef } from "react";

import { Dimensions, FlatList, Pressable, StyleSheet } from "react-native";

import { Text, View, XStack } from "tamagui";
import { SimpleButton } from "../centerTextButton";

const { height } = Dimensions.get("window");

interface Props {
  visible: boolean;
  verses: BibleVerse[];
  selected: number[];
  reference: string;
  onToggle: (v: number) => void;
  onClose: () => void;
  translation: string;
  book: string;
  chapter?: number;
  onDone: (verses: number[]) => void;
}

export default function ScriptureReaderModal({
  visible,
  verses,
  selected,
  reference,
  onToggle,
  onClose,
  onDone,
}: Props) {
  const listRef = useRef<FlatList>(null);

  /* FIND FIRST SELECTED VERSE */

  const firstSelectedIndex = verses.findIndex((v) => v.number === selected[0]);

  /* AUTO SCROLL TO SELECTED */

  useEffect(() => {
    if (visible && firstSelectedIndex >= 0) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: firstSelectedIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }, 200);
    }
  }, [visible]);

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.sheet}>
        {/* HEADER */}

        <XStack justifyContent="space-between" marginBottom={12}>
          <Text fontWeight="700" color="#6B2FA3">
            {reference}
          </Text>

          <Pressable onPress={onClose}>
            <X size={18} />
          </Pressable>
        </XStack>

        {/* SCRIPTURE CONTAINER */}

        <View style={styles.container}>
          <FlatList
            ref={listRef}
            data={verses}
            keyExtractor={(item) => String(item.number)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            getItemLayout={(data, index) => ({
              length: 60,
              offset: 60 * index,
              index,
            })}
            renderItem={({ item }) => {
              const active = selected.includes(item.number);

              return (
                <Pressable
                  style={[styles.verseRow, active && styles.activeVerse]}
                  onPress={() => onToggle(item.number)}
                >
                  <Text fontWeight="700" marginRight={6}>
                    {item.number}
                  </Text>

                  <Text flex={1}>{item.text}</Text>
                </Pressable>
              );
            }}
          />

          {/* FIXED ACTION BAR */}

          <View style={styles.bottomBar}>
            <SimpleButton
              text="Done"
              onPress={() => onDone(selected)}
              textColor={colors.buttonText}
              color={colors.primary}
              style={[
                styles.doneButton,
                selected.length === 0 && styles.disabled,
              ]}
              disabled={selected.length === 0}
            />
          </View>
        </View>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    height: height * 0.9,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  container: {
    flex: 1,
  },

  verseRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },

  activeVerse: {
    backgroundColor: "#EAD9F3",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
  },

  doneButton: {  
    borderRadius: 10,
    alignItems: "center",
  },

  disabled: {
    opacity: 0.4,
  },
});
