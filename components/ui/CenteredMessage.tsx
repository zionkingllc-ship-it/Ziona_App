import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "@/constants/colors";

type Props = {
  text: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function CenteredMessage({
  text,
  subtitle,
  actionLabel,
  onActionPress,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{text}</Text>

      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}

      {actionLabel && onActionPress && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={onActionPress}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
});
