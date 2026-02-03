import colors from "@/constants/colors";

import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XStack } from "tamagui";

 
export default function ProfileScreen() { 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: colors.primary,
            marginBottom: 24,
          }}
        >
          Settings
        </Text>
 
      </ScrollView>
    </SafeAreaView>
  );
}