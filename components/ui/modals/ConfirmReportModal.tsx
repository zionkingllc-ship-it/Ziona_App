// components/modals/ConfirmReportModal.tsx

import colors from "@/constants/colors";
import { AlertCircle } from "@tamagui/lucide-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BaseModal from "./BaseModal";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmReportModal({
  visible,
  onClose,
  onConfirm,
}: Props) {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Text style={{ color: "#fff" }}>✕</Text>
        </TouchableOpacity>
        <AlertCircle fill={colors.errorText} color={colors.white} size={24} alignSelf="center"/>
        <Text style={styles.title}>
          Are you sure you want to report this post ?
        </Text>

        <Text style={styles.subtitle}>Reports are anonymous</Text>

        <TouchableOpacity style={styles.button} onPress={onConfirm}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Report</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 24,
    margin: 20,
  },
  close: {
    backgroundColor: "#7A2E8A",
    width: 24,
    height: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 15,
  },
  subtitle: {
    textAlign: "center",
    marginVertical: 10,
    fontWeight:"500",
    color: "#777",
  },
  button: {
    backgroundColor: "#7A2E8A",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    alignSelf:"center",
    marginTop: 21,
    width:"80%"
  },
});
