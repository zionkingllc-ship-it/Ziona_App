import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";

export default function AddHabitScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.primary }}>
          second tab
        </Text>
      </View>
    </SafeAreaView>
  );
}
