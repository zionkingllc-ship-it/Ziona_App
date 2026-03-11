import CategoryGrid from "@/components/discover/CategoryGrid";
import SearchHeader from "@/components/SearchHeader";
import { DISCOVER_CATEGORIES } from "@/constants/discoverCategories";
import colors from "@/constants/colors";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <YStack flex={1}>
        <SearchHeader value={searchQuery} onChangeText={setSearchQuery} />

        <CategoryGrid
          categories={DISCOVER_CATEGORIES}
          onCategoryPress={(categoryId) =>
            router.push({
              pathname: "/(tabs)/discover/[categoryId]",
              params: { categoryId },
            })
          }
        /> 
      </YStack>
    </SafeAreaView>
  );
}