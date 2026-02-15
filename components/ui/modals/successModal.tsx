// components/modals/SuccessModal.tsx

import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { View, Text } from "tamagui";
import BaseModal from "./BaseModal";

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  autoClose?: boolean;
  duration?: number; // ms
}

export default function SuccessModal({
  visible,
  onClose,
  title = "Thank you for reporting this post",
  message = "Your feedback is important to us, we’ll review the content of this post, you won’t see this user’s post on your feed again.",
  autoClose = true,
  duration = 2000,
}: Props) {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible]);

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.card}>
        {/* Green Check Circle */}
        <View style={styles.iconWrapper}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    alignItems: "center",
    margin:20
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: "#2ECC71",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  check: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
  },
  message: {
    fontSize: 10,
    textAlign: "center",
    color: "#666",
    lineHeight: 18,
  },
});