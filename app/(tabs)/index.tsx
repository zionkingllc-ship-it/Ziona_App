 import colors from "@/constants/colors"; 
import React, { useEffect, useMemo } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
 

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HomeScreen() {
   

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
      }}
    >
      {/* ---------- Header ---------- */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: colors.primary,
          alignSelf: "center",
          marginBottom: 12,
        }}
      >
       home
      </Text>
  
    </SafeAreaView>
  );
}
