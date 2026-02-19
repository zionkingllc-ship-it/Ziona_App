import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from "react-native";
import colors from "@/constants/colors";

type Props = {
  text: string;
  subtitle?: string;

  actionLabel?: string;
  onActionPress?: () => void;

  titleColor?: string;
  subtitleColor?: string;

  fullScreen?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function CenteredMessage({
  text,
  subtitle,
  actionLabel,
  onActionPress,
  titleColor = colors.black,
  subtitleColor = colors.gray,
  fullScreen = true,
  containerStyle,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        fullScreen && { flex: 1 },
        containerStyle,
      ]}
    >
      <Text style={[styles.title, { color: titleColor }]}>
        {text}
      </Text>

      {subtitle && (
        <Text
          style={[styles.subtitle, { color: subtitleColor }]}
        >
          {subtitle}
        </Text>
      )}

      {actionLabel && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
});
