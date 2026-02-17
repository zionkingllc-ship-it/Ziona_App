// components/modals/ReportReasonsModal.tsx

import colors from "@/constants/colors";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View, XStack } from "tamagui";
import { SimpleButtonWithStyle } from "../SimpleButtonWithStyle";
import KeyboardBottomSheetModal from "./KeyboardBottomSheetModal";

const { height } = Dimensions.get("window");

const reasons = [
  "I just don't like it",
  "Misleading information",
  "Nudity or sexual content",
  "Scam or fraud",
  "Unoriginal content",
  "Restricted or against policy content",
  "Other",
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectReason: (reason: string) => void;
}

export default function ReportReasonsModal({
  visible,
  onClose,
  onSelectReason,
}: Props) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const handleSelect = (reason: string) => {
    setSelectedReason(reason);

    if (reason !== "Other") {
      onSelectReason(reason);
    }
  };

  const handleSubmitOther = () => {
    if (!otherText.trim()) return;
    onSelectReason(otherText.trim());
  };

  return (
    <KeyboardBottomSheetModal visible={visible} onClose={onClose}>
      <View style={styles.sheet}>
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={20}
        >
          <Text style={styles.header}>Report</Text>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={{ color: "#fff" }}>✕</Text>
          </TouchableOpacity>
        </XStack>

        <Text style={styles.subHeader}>Why are you reporting this post ?</Text>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {reasons.map((reason) => (
            <TouchableOpacity
              key={reason}
              style={styles.item}
              onPress={() => handleSelect(reason)}
            >
              <Text fontSize="$3">{reason}</Text>
            </TouchableOpacity>
          ))}

          {/* OTHER INPUT */}
          {selectedReason === "Other" && (
            <View
              padding={20}
              marginBottom={selectedReason === "Other" ? 20 : 0}
            >
              <TextInput
                value={otherText}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChangeText={setOtherText}
                placeholder="Explain your reason for reporting this post"
                multiline
                style={styles.textInput}
              />

              <SimpleButtonWithStyle
                text="Done"
                textColor={colors.white}
                color={colors.primary}
                disabled={otherText.length <= 1}
                style={styles.doneButton}
                onPress={handleSubmitOther}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardBottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    height: height * 0.65,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  close: {
    backgroundColor: "#7A2E8A",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "600",
    fontSize: 13,
    left: "40%",
  },
  subHeader: {
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "600",
    fontSize: 16,
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 40,
    maxHeight: 80,
    textAlignVertical: "top",
  },
  doneButton: {
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
    borderRadius: 25,
  },
});
